import Pusher from "pusher-js";
import axios from "axios";
import HandCard from "@/Components/HandCard";
import NewOrderdCard from "@/Components/NewOrderdCard.jsx";
import OrderdFruits from "@/Components/OrderdFruits.jsx";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Link, Head, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Grid, TextField } from "@mui/material";
import { getCardSymbol } from "../utils/cardHelpers.js";
import GameSetup from "@/Components/CreateGame.jsx";
import JoinGame from "@/Components/JoinGame.jsx";
import CreateGame from "@/Components/CreateGame.jsx";

export default function Game() {
    const processing = false;
    const player = 1;
    const { props } = usePage();
    const gameId = props.gameId;
    const playerCount = Number(props.playerCount);
    const [game, setGame] = useState("");
    const [handCard, setHandCard] = useState("");
    const [orderdCard, setOrderdCard] = useState("");
    const [orderdFruits, setOrderdFruits] = useState([]);
    const [decided, setDecided] = useState(true);
    const [stockedItems, setStockedItems] = useState([]);
    const [isStarted, setIsStarted] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isStockEmpty, setIsStockEmpty] = useState(true);
    const [isStockChecked, setIsStockChecked] = useState(false);
    const [deck, setDeck] = useState([]);
    const [selectedFruit, setSelectedFruit] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [playersReady, setPlayersReady] = useState([]);
    const [full, setFull] = useState(false);

    const handlePlayerNameChange = (event) => {
        setPlayerName(event.target.value);
    };

    const handleReadyUp = async () => {
        try {
            const response = await axios.post("/api/player/ready", {
                name: playerName,
                gameId: gameId,
            });
            setFull(response.data.full);
            setIsReady(true);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const pusher = new Pusher("efd2fa33db7ff60f0a6d", {
            cluster: "ap3",
        });

        const channel = pusher.subscribe("game1");
        channel.bind("game-started", function (data) {
            alert(JSON.stringify(data));
            setGame(data);
            console.log("Received game-started event with data:", data);
        });
        channel.bind("pusher:subscription_succeeded", function (members) {
            let playerId = 1;
            console.log(members);
        });
        channel.bind("players-ready", (data) => {
            setPlayersReady((prevPlayers) => {
                // 既に配列に存在するプレイヤーの名前のセットを作成
                const playerNames = new Set(
                    prevPlayers.map((player) => player.name)
                );
                // 新しいプレイヤーが既にセットに存在しない場合のみ追加
                if (!playerNames.has(data.player.name)) {
                    return [...prevPlayers, data.player];
                } else {
                    return prevPlayers;
                }
            });
        });
    }, []);

    useEffect(() => {
        const pusher = new Pusher("efd2fa33db7ff60f0a6d", {
            cluster: "ap3",
        });

        const channel = pusher.subscribe("game1");

        // サーバーから現在のプレイヤーのリストを取得
        const fetchPlayersReady = async () => {
            try {
                const response = await axios.get(`/api/game/${gameId}/players`);
                setPlayersReady(response.data.players);
            } catch (error) {
                console.error(error);
            }
        };

        // コンポーネントのマウント時にプレイヤーのリストを取得
        fetchPlayersReady();

        // Pusherのクリーンアップ
        return () => {
            pusher.unsubscribe("game1");
        };
    }, [gameId]); // gameIdが変わった時にも再実行

    const startGame = async () => {
        try {
            const response = await axios.post("/api/game/start", {
                game: game,
            });
            setHandCard(response.data.handCards);
            setDeck(response.data.deck);
            setStockedItems(response.data.stockedItems);
            setOrderdCard(response.data.orderdCard);
            setOrderdFruits([]);
            setIsStockChecked(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOrderCard = async () => {
        try {
            const response = await axios.post("/api/game/orderCard", {
                game: game,
                deck: deck,
                orderdCard: orderdCard,
                orderdFruits: orderdFruits,
            });
            setOrderdCard(response.data.newOrderdCard);
            setDeck(response.data.deck);
            setDecided(false);
            console.log(orderdFruits);
            console.log(game);
        } catch (error) {
            console.error(error);
        }
    };

    const callMaster = async () => {
        try {
            const response = await axios.post("/api/game/callMaster", {
                orderdFruits: orderdFruits,
                stockedItems: stockedItems,
            });
            setIsStockEmpty(response.data);
            setIsStockChecked(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Head title="Welcome" />
            <Grid container>
                <Grid item xs={6}>
                    {isReady === false && (
                        <>
                            <input
                                type="text"
                                placeholder="名前を入力してください"
                                value={playerName}
                                onChange={handlePlayerNameChange}
                            />
                            <button onClick={handleReadyUp}>準備完了</button>
                        </>
                    )}
                    {full && <p style={{ color: "red" }}>満席です</p>}
                    <ul>
                        {playersReady.map(
                            (player, index) =>
                                player.name && (
                                    <li key={index}>
                                        {player.name} が準備完了しました。
                                    </li>
                                )
                        )}
                    </ul>
                    <HandCard
                        card={handCard}
                        player={player}
                        check={isStockChecked}
                    />
                    <PrimaryButton
                        onClick={startGame}
                        className="ms-4"
                        disabled={
                            processing || playersReady.length !== playerCount
                        }
                    >
                        {isStockChecked ? "新しいゲーム" : "カードを配る"}
                    </PrimaryButton>
                    <SecondaryButton
                        onClick={handleOrderCard}
                        className="ms-4"
                        disabled={processing || isStockChecked}
                    >
                        注文をとる
                    </SecondaryButton>
                    <SecondaryButton
                        onClick={callMaster}
                        className="ms-4"
                        disabled={processing || isStockChecked}
                    >
                        店長を呼ぶ
                    </SecondaryButton>
                    <NewOrderdCard
                        card={orderdCard}
                        selectedFruit={selectedFruit}
                        setSelectedFruit={setSelectedFruit}
                        orderdFruits={orderdFruits}
                        setOrderdFruits={setOrderdFruits}
                        decided={decided}
                        setDecided={setDecided}
                    />
                    {isStockChecked &&
                        (isStockEmpty ? (
                            <div>
                                <p>ナイス！補充するね</p>
                            </div>
                        ) : (
                            <div>まだ在庫あるじゃん！！</div>
                        ))}
                </Grid>
                <Grid item xs={6}>
                    <p>　　❌　　⭕️</p>
                    <OrderdFruits orderdFruits={orderdFruits} />
                </Grid>
                <Grid item xs={12}>
                    <p>お店ID：{gameId}</p>
                </Grid>
            </Grid>
        </>
    );
}
