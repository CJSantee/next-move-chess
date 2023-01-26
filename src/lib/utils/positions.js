/**
 * @description Get position data from fen
 * @param {string} fen
 * @returns {object} position {piece_placement: string, active_color: string}
 */
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

/**
 * @description Shortens complete fen to just piece placement and active color
 * @param {string} fen
 * @returns {string} Shortened fen
 */
export const shortenFen = (fen) => {
  return fen.split(" ").slice(0, 2).join(" ");
};

/**
 * @description Returns shortened fen from position data
 * @param {object} position
 * @param {string} position.piece_placement
 * @param {string} position.active_color
 * @returns {string} shortFen
 */
export const positionToShortFen = ({ piece_placement, active_color }) => {
  return [piece_placement, active_color].join(" ");
};
