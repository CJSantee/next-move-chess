// Assets
import { faCircle } from "@fortawesome/free-solid-svg-icons";
// Hooks
import { useEffect, useState } from "react";
// Libararies
import { Chess } from "chess.js";
// Components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import GamePanel from "../components/GamePanel";
import Board from "../components/Board";
// Services
import { getPosition } from "../lib/positions";

export default function Home() {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState({});

  const [recording, setRecording] = useState(false);

  const [alerts, setAlerts] = useState([]);
  const [overlay, setOverlay] = useState(null);

  useEffect(() => {
    const getPositionFromDB = async () => {
      const position = await getPosition({ fen: game.fen() });
      setPosition(position);
    };
    getPositionFromDB();
  }, [game]);

  const handleMove = async (move) => {
    if (recording) {
      setRecording(false);
    }
    setOverlay(null);
  };

  const addAlert = () => {};

  /**
   * @description Adds an overlay message to the page
   * @param {object} overlay
   * @param {string} overlay.message - Message to dispaly in overlay
   * @param {number} overlay.timeout - Timeout (ms) to remove the overlay
   */
  const addOverlay = ({ message, timeout }) => {
    const removeOverlay = () => {
      setOverlay(null);
    };
    setOverlay(message);
    if (timeout) {
      setTimeout(removeOverlay, timeout);
    }
  };

  return (
    <>
      <Head>
        <title>Next Chess</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='vh-100'>
        <div className='row h-100 g-0'>
          <div className='d-none d-md-flex col-2'></div>
          <div className='col-12 col-sm-8 col-md-7 d-flex flex-column justify-content-center align-items-center max-w-100vh'>
            <Board game={game} setGame={setGame} onMove={handleMove} />
          </div>
          <div className='col-12  col-sm-4 col-md-3 d-flex justify-content-center align-items-center mt-2 flex-fill'>
            <GamePanel
              game={game}
              setGame={setGame}
              position={position}
              setPosition={setPosition}
              recording={recording}
              setRecording={setRecording}
              addOverlay={addOverlay}
              addAlert={addAlert}
            />
          </div>
        </div>
      </main>
      {overlay && (
        <div className='overlay'>
          <div className='bg-secondary bg-opacity-50 opacity-75 rounded p-3'>
            <h2>{overlay}</h2>
          </div>
        </div>
      )}
    </>
  );
}
