export const TYPE_COLORS = {
  normal: { background: "#A8A77A", text: "#fff" },
  fire: { background: "#F04438", text: "#fff" },
  water: { background: "#6390F0", text: "#fff" },
  electric: { background: "#F7D02C", text: "#4f4300" },
  grass: { background: "#78C850", text: "#fff" },
  ice: { background: "#98D8D8", text: "#164e63" },
  fighting: { background: "#C22E28", text: "#fff" },
  poison: { background: "#A33EA1", text: "#fff" },
  ground: { background: "#E2BF65", text: "#55400e" },
  flying: { background: "#A98FF3", text: "#fff" },
  psychic: { background: "#F95587", text: "#fff" },
  bug: { background: "#A6B91A", text: "#fff" },
  rock: { background: "#B6A136", text: "#fff" },
  ghost: { background: "#735797", text: "#fff" },
  dragon: { background: "#6F35FC", text: "#fff" },
  dark: { background: "#705746", text: "#fff" },
  steel: { background: "#B7B7CE", text: "#303047" },
  fairy: { background: "#D685AD", text: "#fff" },
};

export const getTypeName = (type) => {
  const value = typeof type === "object" ? type?.name : type;
  return String(value || "normal").trim().toLowerCase();
};

export const getTypeColors = (type) =>
  TYPE_COLORS[getTypeName(type)] || TYPE_COLORS.normal;

export const getTypeBadgeStyle = (type) => {
  const { background, text } = getTypeColors(type);
  return { background, color: text };
};
