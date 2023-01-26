export const getMovesFromGame = (game) => {
  return game.history().reduce((acc, move, idx) => {
    if (idx % 2 === 0) {
      acc.push({ white: move });
    } else {
      const lastMove = acc[acc.length - 1];
      acc[acc.length - 1] = { ...lastMove, black: move };
    }
    return acc;
  }, []);
};
