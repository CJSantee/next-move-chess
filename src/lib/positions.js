import api from "../core/api";
import { Chess } from "chess.js";
import { positionToShortFen, shortenFen } from "./utils/positions";

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
    queryString = `?fen=${shortenFen(fen)}`;
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
    const uri = `/positions?fen=${positionToShortFen(dbPosition)}`;
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
    const uri = `/positions?fen=${positionToShortFen(dbPosition)}`;
    cache.set(uri, dbPosition);
  }
  return {
    position: dbPosition,
    success,
  };
};

/**
 * @description Gets next position after a random book_move
 * @param {string} fen
 * @param {Array} book_moves
 * @returns
 */
export const getRandomAfterBookMove = async (fen, book_moves) => {
  if (!book_moves.length) {
    throw new Error("No Book Moves found for this position.");
  }
  const game = new Chess();
  game.load(fen);
  const move = book_moves[Math.floor(Math.random() * book_moves.length)];
  game.move(move);
  const position = await getPosition({ fen: game.fen() });
  if (!position) {
    throw new Error(`Book Move ${move} does not have a matching position.`);
  }
  return {
    position,
    move,
  };
};
