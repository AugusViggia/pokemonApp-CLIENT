import style from "./EncounterLocations.module.css";

const formatLabel = (value) => String(value || "Unknown").replace(/-/g, " ");
const formatChance = (encounters) => {
  const chances = [
    ...new Set(
      encounters
        .map((encounter) => Number(encounter.chance))
        .filter((chance) => Number.isFinite(chance)),
    ),
  ].sort((first, second) => first - second);

  if (!chances.length) return "?";
  if (chances[0] === chances[chances.length - 1]) return `${chances[0]}%`;
  return `${chances[0]}%-${chances[chances.length - 1]}%`;
};
const formatLevel = (encounters) => {
  const levels = encounters
    .flatMap((encounter) => [encounter.minLevel, encounter.maxLevel])
    .map(Number)
    .filter((level) => Number.isFinite(level))
    .sort((first, second) => first - second);

  if (!levels.length) return "?";
  if (levels[0] === levels[levels.length - 1]) return String(levels[0]);
  return `${levels[0]}-${levels[levels.length - 1]}`;
};

const VERSION_COLORS = {
  red: ["#e3350d", "#fff"],
  blue: ["#0000ee", "#fff"],
  yellow: ["#fff02a", "#111"],
  gold: ["#f5bf3a", "#111"],
  silver: ["#8f8f8f", "#111"],
  crystal: ["#c066cd", "#111"],
  ruby: ["#bf3c33", "#fff"],
  sapphire: ["#4663c4", "#fff"],
  emerald: ["#2e7d32", "#fff"],
  firered: ["#c35c3f", "#111"],
  leafgreen: ["#a7c957", "#111"],
  diamond: ["#6faabb", "#111"],
  pearl: ["#be86a2", "#111"],
  platinum: ["#d1d1d1", "#111"],
  heartgold: ["#daa520", "#111"],
  soulsilver: ["#777", "#111"],
  black: ["#000", "#fff"],
  white: ["#fff", "#111"],
  "black-2": ["#000", "#fff"],
  "white-2": ["#fff", "#111"],
  x: ["#28629d", "#fff"],
  y: ["#cf344b", "#fff"],
  "omega-ruby": ["#a60000", "#fff"],
  "alpha-sapphire": ["#283c91", "#fff"],
  "lets-go-pikachu": ["#f1c232", "#111"],
  "lets-go-eevee": ["#f1c232", "#111"],
  sword: ["#4aa3df", "#111"],
  shield: ["#d81b60", "#fff"],
  "brilliant-diamond": ["#5ca9c9", "#111"],
  "shining-pearl": ["#d34c92", "#111"],
  scarlet: ["#bd493f", "#fff"],
  violet: ["#9942a9", "#fff"],
  "legends-arceus": ["#71bf8a", "#111"],
  stadium: ["#a184e6", "#111"],
};

const EncounterLocations = ({ locations }) => (
  <div className={style.table}>
    <div className={style.header}>
      <span>VERSION</span>
      <span>LOCATION</span>
      <span>LEVEL</span>
      <span>CHANCE</span>
    </div>
    {locations?.length ? (
      locations.map((versionGroup, index) => {
        const versionKey = String(
          versionGroup.version || "unknown",
        ).toLowerCase();
        const [background, color] = VERSION_COLORS[versionKey] || [
          "#d62828",
          "#fff",
        ];
        return (
          <div className={style.versionRow} key={versionGroup.version || index}>
            <div
              className={style.versionName}
              style={{ backgroundColor: background, color }}
            >
              {formatLabel(versionGroup.version)}
            </div>
            <div className={style.locations}>
              {versionGroup.locations?.length ? (
                versionGroup.locations.map((location) => {
                  const encounters = location.encounters || [
                    { method: "unknown" },
                  ];
                  return (
                    <div className={style.locationRow} key={location.name}>
                      <strong>{formatLabel(location.name)}</strong>
                      <span>{formatLevel(encounters)}</span>
                      <span>{formatChance(encounters)}</span>
                    </div>
                  );
                })
              ) : (
                <span className={style.empty}>No location data available.</span>
              )}
            </div>
          </div>
        );
      })
    ) : (
      <p className={style.empty}>No location data available.</p>
    )}
  </div>
);

export default EncounterLocations;
