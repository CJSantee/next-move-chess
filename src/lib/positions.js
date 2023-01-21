import api from "../core/api";

const cache = new Map();

/**
 * @description Gets a position from the cache or database.
 * @param {object} params
 * @param {string} params.fen - Fen to query for position by
 * @returns {object} position
 */
export const getPosition = async ({ fen }) => {
  let queryString = "";
  if (fen) {
    const shortenedFen = fen.split(" ").slice(0, 2).join(" ");
    queryString = `?fen=${shortenedFen}`;
  }
  const uri = `/positions${queryString}`;

  const cached = cache.get(uri);
  if (cached) {
    return cached;
  }

  const {
    data: [position],
    success,
    error,
  } = await api.get(`/positions${queryString}`);
  if (success) {
    cache.set(uri, position);
  } else {
    console.error(error);
  }
  return position;
};

/**
 * @description updates a position given it's id
 * @param {object} position
 * @returns {object} {position, success}
 */
export const updatePositionById = async ({ id, name, book_moves }) => {
  const {
    data: dbPosition,
    success,
    error,
  } = await api.patch(`/position/${id}`, { name, book_moves });
  if (error) {
    console.error(error);
  }
  if (success) {
    const uri = `/positions?fen=${[
      dbPosition.piece_placement,
      dbPosition.active_color,
    ].join(" ")}`;
    cache.set(uri, dbPosition);
  }
  return {
    position: dbPosition,
    success,
  };
};

/**
 * @description Post a new position to the database
 * @param {object} position
 * @returns {object} {position, success}
 */
export const postPosition = async (position) => {
  const {
    data: dbPosition,
    success,
    error,
  } = await api.post("/positions", position);
  if (error) {
    console.error(error);
  }
  if (success) {
    const uri = `/positions?fen=${[
      dbPosition.piece_placement,
      dbPosition.active_color,
    ].join(" ")}`;
    cache.set(uri, dbPosition);
  }
  return {
    position: dbPosition,
    success,
  };
};
