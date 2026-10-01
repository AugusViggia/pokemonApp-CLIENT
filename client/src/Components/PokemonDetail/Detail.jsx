import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import { deletePokemon } from "../../Redux/Actions/Actions-Functions/actions-pokemons";
import DetailFeedbackModal from "./DetailFeedbackModal";
import EncounterLocations from "./EncounterLocations";
import style from "./Detail.module.css";
import { getTypeColors, getTypeName, getTypeBadgeStyle } from "../../styles/typeColors";

const PokemonArtwork = ({
  name,
  normalImage,
  shinyImage,
  interactive = false,
  className,
  label,
  children,
}) => {
  const [isShiny, setIsShiny] = useState(false);
  const image = isShiny && shinyImage ? shinyImage : normalImage;

  return (
    <div className={`${style.artwork} ${className || ""}`}>
      <img src={image} alt={name} />
      {label && (
        <div className={style.chainNameRow}>
          <strong>{label}</strong>
          {interactive && (
            <button
              type="button"
              className={style.shinyButton}
              disabled={!shinyImage}
              onClick={() => shinyImage && setIsShiny((value) => !value)}
            >
              {isShiny ? "NORMAL" : "SHINY"}
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

const formatEvolutionTrigger = (trigger, formatLabel) => {
  const triggerLabels = {
    "level-up": "Level up",
    trade: "Trade",
    "use-item": "Use",
    shed: "Shed",
    spin: "Spin",
    "tower-of-darkness": "Complete Tower of Darkness",
    "tower-of-waters": "Complete Tower of Waters",
    "three-critical-hits": "Land three critical hits",
    "take-damage": "Take damage",
  };

  return triggerLabels[trigger] || formatLabel(trigger);
};

const evolutionRequirementForDetail = (detail, formatLabel) => {
  if (!detail) return "Evolution";

  const hasOnlyLevelRequirement =
    detail.trigger === "level-up" &&
    detail.minLevel != null &&
    detail.minHappiness == null &&
    detail.minBeauty == null &&
    detail.minAffection == null &&
    !detail.item &&
    !detail.heldItem &&
    !detail.knownMove &&
    !detail.knownMoveType &&
    !detail.usedMove &&
    detail.minMoveCount == null &&
    detail.gender == null &&
    !detail.location &&
    !detail.timeOfDay &&
    !detail.tradeSpecies &&
    !detail.partySpecies &&
    !detail.partyType &&
    detail.relativePhysicalStats == null &&
    !detail.nearSpecialRock &&
    !detail.needsMultiplayer &&
    !detail.needsOverworldRain &&
    !detail.turnUpsideDown &&
    !detail.region &&
    !detail.requiredPokemonForm &&
    !detail.evolvedPokemonForm &&
    !detail.allowedNatures?.length &&
    !detail.conditionExpression &&
    detail.minSteps == null &&
    detail.minDamageTaken == null;

  if (hasOnlyLevelRequirement) return `Level ${detail.minLevel}`;

  const parts = [];
  const trigger = detail.trigger
    ? formatEvolutionTrigger(detail.trigger, formatLabel)
    : null;

  if (trigger) parts.push(trigger);

  if (detail.minLevel != null) parts.push(`at level ${detail.minLevel}`);
  if (detail.minHappiness != null) parts.push("with high Friendship");
  if (detail.minBeauty != null) parts.push("with high Beauty");
  if (detail.minAffection != null) parts.push("with high Affection");

  if (detail.item) {
    parts.push(`${detail.trigger === "use-item" ? "with" : "using"} ${formatLabel(detail.item)}`);
  }

  if (detail.heldItem) {
    parts.push(`while holding ${formatLabel(detail.heldItem)}`);
  }

  if (detail.knownMove) {
    parts.push(`while knowing ${formatLabel(detail.knownMove)}`);
  }

  if (detail.knownMoveType) {
    parts.push(`while knowing a ${formatLabel(detail.knownMoveType)}-type move`);
  }

  if (detail.usedMove) {
    parts.push(`after using ${formatLabel(detail.usedMove)}`);
  }

  if (detail.minMoveCount != null) {
    const moveLabel = detail.usedMove ? formatLabel(detail.usedMove) : "the move";
    parts.push(`after using ${moveLabel} ${detail.minMoveCount} times`);
  }

  if (detail.gender != null) {
    const genderLabel = detail.gender === 1 ? "female" : detail.gender === 2 ? "male" : "the required gender";
    parts.push(`if ${genderLabel}`);
  }

  if (detail.location) parts.push(`at ${formatLabel(detail.location)}`);
  if (detail.timeOfDay) {
    parts.push(detail.timeOfDay === "night" ? "at night" : "during the day");
  }

  if (detail.tradeSpecies) {
    parts.push(`when traded for ${formatLabel(detail.tradeSpecies)}`);
  }

  if (detail.partySpecies) {
    parts.push(`with ${formatLabel(detail.partySpecies)} in your party`);
  }

  if (detail.partyType) {
    parts.push(`with a ${formatLabel(detail.partyType)}-type Pokémon in your party`);
  }

  if (detail.relativePhysicalStats === 1) {
    parts.push("with Attack higher than Defense");
  } else if (detail.relativePhysicalStats === 0) {
    parts.push("with Attack equal to Defense");
  } else if (detail.relativePhysicalStats === -1) {
    parts.push("with Defense higher than Attack");
  }

  if (detail.nearSpecialRock) parts.push("near a special rock");
  if (detail.needsMultiplayer) parts.push("with multiplayer");
  if (detail.needsOverworldRain) parts.push("while it's raining");
  if (detail.turnUpsideDown) parts.push("while the console is upside down");
  if (detail.region) parts.push(`in ${formatLabel(detail.region)}`);
  if (detail.requiredPokemonForm) {
    parts.push(`in ${formatLabel(detail.requiredPokemonForm)} form`);
  }
  if (detail.allowedNatures?.length) {
    const natures = detail.allowedNatures.map(formatLabel).join(", ");
    parts.push(`with ${natures} nature`);
  }
  if (detail.minSteps != null) {
    parts.push(`after walking ${detail.minSteps} steps`);
  }
  if (detail.minDamageTaken != null) {
    parts.push(`after taking ${detail.minDamageTaken} damage`);
  }

  return parts.join(" ").trim() || "Evolution";
};

const evolutionRequirement = (details, formatLabel) => {
  const requirements = (details || [])
    .map((detail) => evolutionRequirementForDetail(detail, formatLabel))
    .filter(Boolean);

  return requirements.join("; ") || "Evolution";
};

const EvolutionNode = ({ node, currentName, currentImage, formatLabel }) => {
  if (!node) return null;

  return (
    <div
      className={
        node.name === currentName
          ? "evolutionNode currentEvolution"
          : "evolutionNode"
      }
    >
      <div className="evolutionPokemon">
        {(node.name === currentName ? currentImage : node.image) && (
          <img
            src={node.name === currentName ? currentImage : node.image}
            alt={node.name}
          />
        )}
        <strong>{formatLabel(node.name)}</strong>
      </div>
      {(node.evolutionDetails || []).length > 0 && (
        <span className="evolutionRequirement">
          {evolutionRequirement(node.evolutionDetails, formatLabel)}
        </span>
      )}
      {(node.evolvesTo || []).map((child) => (
        <div className="evolutionBranch" key={child.name}>
          <span className="evolutionArrow">↓</span>
          <EvolutionNode
            node={child}
            currentName={currentName}
            currentImage={currentImage}
            formatLabel={formatLabel}
          />
        </div>
      ))}
    </div>
  );
};

const findEvolutionNode = (node, name) => {
  if (!node) return null;
  if (node.name === name) return node;
  for (const child of node.evolvesTo || []) {
    const match = findEvolutionNode(child, name);
    if (match) return match;
  }
  return null;
};

const flattenEvolutionChain = (node) => {
  if (!node) return [];
  return [node, ...(node.evolvesTo || []).flatMap(flattenEvolutionChain)];
};

const MEGA_STONES = {
  venusaur: "Venusaurite",
  charizard: "Charizardite",
  blastoise: "Blastoisinite",
  alakazam: "Alakazite",
  gengar: "Gengarite",
  kangaskhan: "Kangaskhanite",
  pinsir: "Pinsirite",
  gyarados: "Gyaradosite",
  aerodactyl: "Aerodactylite",
  mewtwo: "Mewtwonite",
  ampharos: "Ampharosite",
  heracross: "Heracronite",
  houndoom: "Houndoominite",
  tyranitar: "Tyranitarite",
  blaziken: "Blazikenite",
  gardevoir: "Gardevoirite",
  mawile: "Mawilite",
  aggron: "Aggronite",
  medicham: "Medichamite",
  manectric: "Manectite",
  banette: "Banettite",
  absol: "Absolite",
  garchomp: "Garchompite",
  lucario: "Lucarionite",
  abomasnow: "Abomasite",
  beedrill: "Beedrillite",
  pidgeot: "Pidgeotite",
  slowbro: "Slowbronite",
  steelix: "Steelixite",
  sceptile: "Sceptilite",
  swampert: "Swampertite",
  sableye: "Sablenite",
  sharpedo: "Sharpedonite",
  camerupt: "Cameruptite",
  altaria: "Altarianite",
  audino: "Audinite",
  gallade: "Galladite",
  lopunny: "Lopunnite",
  salamence: "Salamencite",
  metagross: "Metagrossite",
  latias: "Latiasite",
  latios: "Latiosite",
  rayquaza: "Rayquazite",
  diancie: "Diancite",
};

const getSpecialFormRequirement = (form, fallbackRequirement, formatLabel) => {
  if (form?.requirement) return formatLabel(form.requirement);

  const name = String(form?.name || "").toLowerCase();
  if (name.endsWith("-gmax")) return "Gigantamax";

  if (name.includes("-mega")) {
    const baseName = name
      .replace(/-mega-x$/, "")
      .replace(/-mega-y$/, "")
      .replace(/-mega$/, "");
    const stone = MEGA_STONES[baseName];

    if (stone) {
      if (name.endsWith("-mega-x")) return `${stone} X`;
      if (name.endsWith("-mega-y")) return `${stone} Y`;
      return stone;
    }
  }

  return formatLabel(fallbackRequirement);
};

const PokemonForms = ({ forms, formatLabel }) => {
  const list = Array.isArray(forms) ? forms : [];
  if (!list.length) return null;

  return (
    <section className={style.formsSection}>
      <div className={style.formsTitle}>
        <span className={style.eyebrow}>FORMS</span>
      </div>
      <div className={style.formsFlow}>
        {list.map((form) => (
          <div className={style.formCard} key={form.name}>
            {form.image && (
              <img src={form.image} alt={formatLabel(form.name)} />
            )}
            <strong>{formatLabel(form.name)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
};

const SpecialForms = ({ forms, formatLabel }) => {
  const mega = forms?.mega || [];
  const gigantamax = forms?.gigantamax || [];

  if (!mega.length && !gigantamax.length) return null;

  const renderFormRow = (form, fallbackRequirement) => (
    <div className={style.specialFormRow} key={form.name}>
      <div className={style.specialFormInfo}>
        <span className={style.specialFormArrow}>→</span>
        <span className={style.specialFormRequirement}>
          With {getSpecialFormRequirement(form, fallbackRequirement, formatLabel)}
        </span>
      </div>
      <div className={style.specialForm}>
        {form.image && (
          <img src={form.image} alt={formatLabel(form.name)} />
        )}
        <span>{formatLabel(form.name)}</span>
      </div>
    </div>
  );

  return (
    <div className={style.specialForms}>
      {mega.length > 0 && (
        <div className={style.specialFormGroup}>
          <div className={style.specialFormList}>
            {mega.map((form) => renderFormRow(form, "Mega Evolution"))}
          </div>
        </div>
      )}

      {gigantamax.length > 0 && (
        <div className={`${style.specialFormGroup} ${style.specialFormGroupGigantamax}`}>
          <div className={style.specialFormList}>
            {gigantamax.map((form) => renderFormRow(form, "Gigantamax"))}
          </div>
        </div>
      )}
    </div>
  );
};

const EvolutionChain = ({
  chain,
  currentName,
  currentImage,
  shinyImage,
  formatLabel,
}) => {
  const nodes = flattenEvolutionChain(chain);
  const isEevee = String(currentName || "").toLowerCase() === "eevee";

  if (isEevee) {
    const eeveeNode = findEvolutionNode(chain, "eevee") || chain;
    const eeveeEvolutions = eeveeNode?.evolvesTo || [];
    const eeveeSpecialForms = [
      ...(eeveeNode?.specialForms?.gigantamax || []),
      ...(eeveeNode?.specialForms?.mega || []),
    ];

    return (
      <section className={`${style.evolutionFlow} ${style.eeveeEvolutionFlow}`}>
        <div className={style.eeveeCurrentColumn}>
          <PokemonArtwork
            name={currentName}
            normalImage={currentImage}
            shinyImage={shinyImage}
            interactive
            label={formatLabel(currentName)}
            className={style.chainArtworkCurrent}
          />
        </div>

        <div className={style.eeveeRequirementColumn}>
          {eeveeSpecialForms.map((form) => (
            <div className={style.eeveeRequirementRow} key={`special-${form.name}`}>
              <span className={style.specialFormArrow}>→</span>
              <span className={style.specialFormRequirement}>
                {getSpecialFormRequirement(form, "Gigantamax", formatLabel)}
              </span>
            </div>
          ))}
          {eeveeEvolutions.map((evolution) => (
            <div className={style.eeveeRequirementRow} key={`requirement-${evolution.name}`}>
              <span className={style.evolutionConnectorArrow}>→</span>
              <span className={style.eeveeRequirement}>
                {evolutionRequirement(evolution.evolutionDetails, formatLabel)}
              </span>
            </div>
          ))}
        </div>

        <div className={style.eeveeEvolutionColumn}>
          {eeveeSpecialForms.map((form) => (
            <div className={style.eeveeEvolutionCard} key={`special-image-${form.name}`}>
              {form.image && <img src={form.image} alt={formatLabel(form.name)} />}
              <span>{formatLabel(form.name)}</span>
            </div>
          ))}
          {eeveeEvolutions.map((evolution) => (
            <div className={style.eeveeEvolutionCard} key={`evolution-${evolution.name}`}>
              {evolution.image && <img src={evolution.image} alt={formatLabel(evolution.name)} />}
              <span>{formatLabel(evolution.name)}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className={style.evolutionFlow}
    >
      {nodes.map((node, index) => {
        const isCurrent = node.name === currentName;

        return (
          <div className={style.evolutionStep} key={`${node.name}-${index}`}>
            <PokemonArtwork
              name={node.name}
              normalImage={isCurrent ? currentImage : node.image}
              shinyImage={isCurrent ? shinyImage : null}
              interactive={isCurrent}
              label={formatLabel(node.name)}
              className={
                isCurrent
                  ? style.chainArtworkCurrent
                  : style.chainArtwork
              }
            />

            {(node.specialForms?.mega?.length || node.specialForms?.gigantamax?.length) ? (
              <SpecialForms
                forms={node.specialForms}
                formatLabel={formatLabel}
              />
            ) : null}

            {index < nodes.length - 1 && (
              <div className={style.evolutionConnector}>
                <span>
                  {evolutionRequirement(
                    nodes[index + 1].evolutionDetails,
                    formatLabel
                  )}
                </span>
                <b>→</b>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

const Detail = () => {
  const pokemonDetails = useSelector((state) => state.details);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dispatch = useDispatch();

  const pokemon = Array.isArray(pokemonDetails)
    ? pokemonDetails[0]
    : pokemonDetails;
  const types = pokemon?.types || [];
  const evolutionChain = Array.isArray(pokemon?.evolutionChain)
    ? (pokemon.evolutionChain.length ? pokemon.evolutionChain : null)
    : (pokemon?.evolutionChain || null);
  const locations = pokemon?.locations || [];
  const formatLabel = (value) => {
    const label = String(value || "Unknown").replace(/-/g, " ");
    return label.charAt(0).toUpperCase() + label.slice(1);
  };
  const normalImage = pokemon?.normalImage || pokemon?.image;
  const shinyImage = pokemon?.shinyImage || null;
  const locationGroups = locations.map((group, index) => ({
    version: group.version || group.game || group.name || `Game ${index + 1}`,
    locations: Array.isArray(group.locations)
      ? group.locations
      : group.name
        ? [group]
        : [],
  }));
  const primaryType = getTypeName(types[0]);
  const primaryTypeColor = getTypeColors(primaryType).background;
  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await dispatch(deletePokemon(id));
      navigate("/home", {
        state: {
          restore: location.state?.fromHome || null,
          refreshOnEnter: true,
          triggerHomeLoading: true,
          homeLoadingKey: Date.now(),
        },
      });
    } catch (error) {
      setDeleting(false);
      setDeleteError(
        error.response?.data?.error || "The Pokemon could not be deleted.",
      );
    }
  };
  const capitalizedName = pokemon?.name
    ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
    : "Pokemon";


  if (deleting) {
    return <Loading />;
  }

  return (
    <div className={style.container}>
      <main className={style.page}>
        <Link
          to="/home"
          state={{
            restore: location.state?.fromHome || null,
            triggerHomeLoading: true,
            homeLoadingKey: Date.now(),
          }}
          onClick={(event) => {
            event.preventDefault();
            navigate("/home", {
              state: {
                restore: location.state?.fromHome || null,
                triggerHomeLoading: true,
                homeLoadingKey: Date.now(),
              },
            });
          }}
          className={style.button}
        >
          BACK TO POKEDEX
        </Link>
        {pokemon?.created && (
          <button
            type="button"
            className={style.deleteButton}
            onClick={() => setConfirmDelete(true)}
          >
            DELETE POKEMON
          </button>
        )}
        <section
          className={style.wrapper}
          style={{ "--type-accent": primaryTypeColor }}
        >
          <header className={style.header}>
            <span className={style.eyebrow}>NAME</span>
            <h1 className={style.name}>{capitalizedName}</h1>
          </header>
          {evolutionChain ? (
            <section className={style.evolutionSection}>
              <div className={style.evolutionLine}>
                {Array.isArray(evolutionChain) ? (
                  evolutionChain.map((evolution) => (
                    <div
                      className={`${style.evolutionItem} ${evolution.name === pokemon?.name ? style.currentEvolution : ""}`}
                      key={evolution.name}
                    >
                      <img
                        src={
                          evolution.name === pokemon?.name
                            ? normalImage
                            : evolution.image
                        }
                        alt={evolution.name}
                      />
                      <span>{formatLabel(evolution.name)}</span>
                    </div>
                  ))
                ) : (
                  <EvolutionChain
                    chain={evolutionChain}
                    currentName={pokemon?.name}
                    currentImage={normalImage}
                    shinyImage={shinyImage}
                    formatLabel={formatLabel}
                  />
                )}
              </div>
            </section>
          ) : (
            <section className={style.evolutionSection}>
              <div className={style.evolutionLine}>
                <PokemonArtwork
                  name={pokemon?.name}
                  normalImage={normalImage}
                  shinyImage={shinyImage}
                  interactive
                  label={formatLabel(pokemon?.name)}
                  className={style.chainArtworkCurrent}
                />
              </div>
            </section>
          )}
          {(() => {
            const currentEvolutionNode =
              !Array.isArray(evolutionChain) && evolutionChain
                ? findEvolutionNode(evolutionChain, pokemon?.name)
                : null;
            const forms = currentEvolutionNode?.forms || [];
            return <PokemonForms forms={forms} formatLabel={formatLabel} />;
          })()}
          <div className={style.infoDiv}>
            <div className={style.statsTypesLayout}>
              <div className={style.statsColumn}>
                <div className={style.sectionHeader}>
                  <span className={style.eyebrow}>BASE STATS</span>
                </div>
                <div className={style.grid}>
                  {[
                    ["HP", pokemon?.hp],
                    ["HEIGHT", pokemon?.height],
                    ["WEIGHT", pokemon?.weight == null
                      ? 0
                      : `${pokemon?.created ? pokemon.weight : Number(pokemon.weight) / 10} kg`],
                    ["ATTACK", pokemon?.attack],
                    ["DEFENSE", pokemon?.defense],
                    ["SPEED", pokemon?.speed],
                  ].map(([label, value]) => (
                    <div className={style.detail} key={label}>
                      <p className={style.label}>{label}</p>
                      <p className={style.value}>{value ?? 0}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={style.types}>
                <div className={style.sectionHeader}>
                  <span className={style.eyebrow}>TYPES</span>
                </div>
                <div className={style.typeList}>
                  {types.map((type, index) => (
                    <span
                      className={style.type}
                      style={getTypeBadgeStyle(type)}
                      key={type.id || index}
                    >
                      {getTypeName(type)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {locations.length > 0 && (
            <div className={style.extraInfo}>
              <EncounterLocations locations={locationGroups} />
            </div>
          )}
        </section>
      </main>
      <div className={style.copyright}>
        Copyright&copy; {new Date().getFullYear()} All rights reserved
      </div>
      {confirmDelete && (
        <DetailFeedbackModal
          title="Delete Pokemon?"
          message={`Are you sure you want to delete ${capitalizedName}? This action cannot be undone.`}
          confirmLabel="DELETE"
          onConfirm={() => {
            setConfirmDelete(false);
            handleDelete();
          }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      {deleteError && (
        <DetailFeedbackModal
          title="Delete failed"
          message={deleteError}
          error
          onConfirm={() => setDeleteError("")}
        />
      )}
    </div>
  );
};

export default Detail;
