import style from "./EncounterLocations.module.css";
import { getGameVersionColors } from "../../styles/gameVersionColors";

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
        const version = versionGroup.version || versionGroup.game || versionGroup.version_group || versionGroup.name || "unknown";
        const { background, color } = getGameVersionColors(version);
        return (
          <div className={style.versionRow} key={versionGroup.version || index}>
            <div
              className={style.versionName}
              style={{ backgroundColor: background, color }}
            >
              {formatLabel(typeof version === "object" ? version.name : version)}
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
