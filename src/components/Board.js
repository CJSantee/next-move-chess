import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

function Board({ game, setGame, onMove }) {
  const [moveFrom, setMoveFrom] = useState("");

  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});

  const handleMove = (moveOptions) => {
    const gameCopy = new Chess();
    gameCopy.loadPgn(game.pgn());
    const move = gameCopy.move(moveOptions);
    if (move) {
      setGame(gameCopy);
      setMoveFrom("");
      setOptionSquares({});
      onMove(move);
    }
    return move;
  };

  const getMoveOptions = (square) => {
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      return;
    }

    const newSquares = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
  };

  const onSquareClick = (square) => {
    setRightClickedSquares({});

    const resetFirstMove = (square) => {
      setMoveFrom(square);
      getMoveOptions(square);
    };

    // from square
    if (!moveFrom) {
      resetFirstMove(square);
      return;
    }

    const move = handleMove({
      from: moveFrom,
      to: square,
    });

    if (!move) {
      resetFirstMove(square);
    }
  };

  function onSquareRightClick(square) {}

  const onDrag = (piece, sourceSquare) => {
    setMoveFrom(sourceSquare);
    getMoveOptions(sourceSquare);
  };

  const onDrop = (sourceSquare, targetSquare) => {
    handleMove({ from: sourceSquare, to: targetSquare });
  };

  return (
    <Chessboard
      id='chessboard'
      position={game.fen()}
      onSquareClick={onSquareClick}
      onSquareRightClick={onSquareRightClick}
      onPieceDragBegin={onDrag}
      onPieceDrop={onDrop}
      customBoardStyle={{
        borderRadius: "4px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
      }}
      customSquareStyles={{
        ...optionSquares,
        ...rightClickedSquares,
      }}
    />
  );
}

export default Board;
