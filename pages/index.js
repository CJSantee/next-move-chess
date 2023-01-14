import Head from "next/head";

import Position from "../models/Position";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

import dbConnect from "../lib/dbConnect";
import { useState } from "react";
import Board from "../components/Board";
import { Chess } from "chess.js";
import GamePanel from "../components/GamePanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Home({ isConnected, positions }) {
  const [game, setGame] = useState(new Chess());

  const handleMove = async (move) => {};

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
          <div className='d-none d-md-flex col-3'></div>
          <div className='col-12 col-sm-8 col-md-6 d-flex flex-column h-100 justify-content-center align-items-center'>
            <div
              className={`d-flex w-100 justify-content-end mb-1 ${
                isConnected ? "text-success" : "text-danger"
              }`}
            >
              <FontAwesomeIcon icon={faCircle} />
            </div>
            <Board game={game} setGame={setGame} onMove={handleMove} />
          </div>
          <div className='col-12  col-sm-4 col-md-3 d-flex justify-content-center align-items-center'>
            <GamePanel game={game} setGame={setGame} />
          </div>
        </div>
      </main>
    </>
  );
}

// export async function getServerSideProps() {
//   try {
//     await dbConnect();

//     return {
//       props: { isConnected: true, positions },
//     };
//   } catch (e) {
//     console.error(e);
//     return {
//       props: { isConnected: false },
//     };
//   }
// }
