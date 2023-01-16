export const fenToPosition = (fen) => {
  if (!fen) {
    return {};
  }
  const [piece_placement, active_color] = fen.split(" ");
  return {
    piece_placement,
    active_color,
  };
};
