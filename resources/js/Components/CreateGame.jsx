import React from "react";

import axios from "axios";
import { useState } from "react";

function CreateGame({}) {
    const [playerCount, setPlayerCount] = useState(4);
    const [gameId, setGameId] = useState(1);

    const createGame = async () => {
        try {
            const response = await axios.post("/api/game/createGame", {
                playerCount,
                gameId,
            });
            setGameId(response.data.gameId);
            window.location.href = response.data.redirectUrl;
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <select
                value={playerCount}
                onChange={(e) => setPlayerCount(e.target.value)}
            >
                <option value={2}>2 players</option>
                <option value={3}>3 players</option>
                <option value={4}>4 players</option>
                {/* Add more options as needed */}
            </select>
            <button
                style={{
                    backgroundColor: "#ff6347" /* 背景色 */,
                    color: "white" /* 文字色 */,
                    padding: "10px" /* パディング */,
                    borderRadius: "5px" /* 角の丸み */,
                    border: "none" /* ボーダー */,
                    cursor: "pointer" /* カーソル */,
                    fontSize: "15px" /* フォントサイズ */,
                }}
                onClick={createGame}
            >
                お店を開く
            </button>
        </div>
    );
}

export default CreateGame;
