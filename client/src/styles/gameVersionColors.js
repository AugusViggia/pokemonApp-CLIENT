export const GAME_VERSION_COLORS = Object.freeze({
  red: "#c62828",
  blue: "#2563a6",
  yellow: "#e2bd24",
  gold: "#c99a16",
  silver: "#8a9aa8",
  crystal: "#536fa3",
  ruby: "#a8202c",
  sapphire: "#2355a4",
  emerald: "#17845d",
  firered: "#c74638",
  leafgreen: "#63a84b",
  diamond: "#4a94bd",
  pearl: "#d58cac",
  platinum: "#77839a",
  heartgold: "#bd941d",
  soulsilver: "#8e9fae",
  black: "#34383f",
  white: "#f0f2f4",
  "black-2": "#252a32",
  "white-2": "#c9d3df",
  x: "#2373a8",
  y: "#c73d55",
  "omega-ruby": "#991f27",
  "alpha-sapphire": "#254b91",
  sun: "#e7a52d",
  moon: "#59466f",
  "ultra-sun": "#d68b20",
  "ultra-moon": "#3e3e75",
  "lets-go-pikachu": "#e5b82c",
  "lets-go-eevee": "#98704b",
  sword: "#2f78a5",
  shield: "#b9364c",
  "brilliant-diamond": "#3984ac",
  "shining-pearl": "#c8799b",
  "legends-arceus": "#507e68",
  scarlet: "#bd4249",
  violet: "#7657a5",
  stadium: "#7053a3",
  "stadium-2": "#426f93",
  colosseum: "#bd664d",
  "xd": "#52699a",
  "black-white": "#43464c",
  "black-2-white-2": "#8d9aaa",
  "sun-moon": "#a77a4d",
  "ultra-sun-ultra-moon": "#85814a",
  "sword-shield": "#806377",
  "scarlet-violet": "#875a79",
});

const normalizeVersionName = (value) => {
  const rawName = typeof value === "object" && value !== null
    ? value.name || value.version?.name || value.version_group?.name || ""
    : value;

  const key = String(rawName || "unknown")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/^pokemon[-\s]+/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^(black|white|ultra-sun|ultra-moon)(\d+)$/, "$1-$2");

  const aliases = {
    "fire-red": "firered",
    "leaf-green": "leafgreen",
    "heart-gold": "heartgold",
    "soul-silver": "soulsilver",
  };
  return aliases[key] || key;
};

const toRgb = (hex) => {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((part) => part + part).join("")
    : normalized;

  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
};

const getRelativeLuminance = (hex) => {
  const [red, green, blue] = toRgb(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const getReadableTextColor = (background) => {
  const luminance = getRelativeLuminance(background);
  const whiteContrast = 1.05 / (luminance + 0.05);
  const darkContrast = (luminance + 0.05) / 0.05;
  return whiteContrast >= darkContrast ? "#ffffff" : "#172033";
};

const getFallbackColor = (versionKey) => {
  let hash = 2166136261;
  for (let index = 0; index < versionKey.length; index += 1) {
    hash ^= versionKey.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  const hue = Number((((hash >>> 0) / 0x100000000) * 360).toFixed(2));
  return `hsl(${hue} 42% 38%)`;
};

export const getGameVersionColors = (version) => {
  const key = normalizeVersionName(version);
  const background = GAME_VERSION_COLORS[key] || getFallbackColor(key || "unknown");

  // HSL fallback colors are intentionally paired with white text for reliable contrast.
  const color = GAME_VERSION_COLORS[key]
    ? getReadableTextColor(background)
    : "#ffffff";

  return { background, color };
};

export { normalizeVersionName };
