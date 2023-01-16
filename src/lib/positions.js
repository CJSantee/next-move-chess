import api from "../core/api";

const cache = new Map();

/**
 * @description Gets a position from the cache or database.
 * @param {object} params
 * @param {string} params.fen - Fen to query for position by
 * @returns {object} position
 */
export const getPosition = async ({ fen }) => {
  const queryString = fen ? `?fen=${fen}` : "";
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
export const updatePositionById = async ({ id, name }) => {
  const {
    data: position,
    success,
    error,
  } = await api.patch(`/position/${id}`, { name });
  if (error) {
    console.error(error);
  }
  return {
    position,
    success,
  };
};
