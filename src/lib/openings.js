import api from "../core/api";
import { shortenFen } from "./utils/positions";

/**
 * @description Gets all openings in the db
 * @returns {Array} openings
 */
export const getAllOpenings = async () => {
  const { data: openings, success, errror } = await api.get("/openings");
  return openings;
};

/**
 * @description Gets an opening
 * @param {object} params
 * @param {string} params.fen
 * @returns {object} Opening
 */
export const getOpening = async ({ fen }) => {
  let queryString = "";
  if (fen) {
    queryString = `?fen=${shortenFen(fen)}`;
  }
  const uri = `/openings${queryString}`;

  const {
    data: [opening],
    success,
    error,
  } = await api.get(uri);
  if (success) {
    // Do nothing
  } else {
    console.error(error);
  }
  return opening;
};

/**
 * @description updates an opening given it's id
 * @param {object} opening
 * @param {string} opening.id
 * @param {string} opening.name
 * @param {Array} opening.moves
 * @param {string} opening.fen
 * @returns {object} {opening, success}
 */
export const updateOpeningById = async ({ id, name, moves, fen }) => {
  const {
    data: dbOpening,
    success,
    error,
  } = await api.patch(`/opening/${id}`, {
    name,
    moves,
    fen: shortenFen(fen),
  });
  if (error) {
    console.error(error);
  }
  if (success) {
    // Do nothing
  }
  return {
    opening: dbOpening,
    success,
  };
};

/**
 * @description Post a new opening to the database
 * @param {object} opening
 * @returns {object} {opening, success}
 */
export const postOpening = async (opening) => {
  const {
    data: dbOpening,
    success,
    error,
  } = await api.post("/openings", opening);
  if (error) {
    console.error(error);
  }
  return {
    opening: dbOpening,
    success,
  };
};
