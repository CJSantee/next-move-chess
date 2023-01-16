import api from "../core/api";

const cache = new Map();

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
