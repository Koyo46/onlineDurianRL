import Pusher from "pusher-js";
import axios from "axios";
import HandCards from "@/Components/HandCards";
import NewOrderdCard from "@/Components/NewOrderdCard.jsx";
import OrderdFruits from "@/Components/OrderdFruits.jsx";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Link, Head, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Grid, TextField } from "@mui/material";

export default function Game() {
    const processing = false;
    const { props } = usePage();
    const gameId = props.gameId;
    const playerCount = Number(props.playerCount);
    const [sessionId, setSessionId] = useState("");
    const [handCards, setHandCards] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState("");
    const [orderdCard, setOrderdCard] = useState("");
    const [orderdFruits, setOrderdFruits] = useState([]);
    const [decided, setDecided] = useState(true);
    const [stockedItems, setStockedItems] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [isStockEmpty, setIsStockEmpty] = useState(true);
    const [isStockChecked, setIsStockChecked] = useState(false);
    const [deck, setDeck] = useState([]);
    const [selectedFruit, setSelectedFruit] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [readyUpPlayers, setReadyUpPlayers] = useState([]);
    const [full, setFull] = useState(false);

    const handlePlayerNameChange = (event) => {
        setPlayerName(event.target.value);
    };

    // // コンポーネントがマウントされた時にローカルストレージからsessionIdを読み込む
    // useEffect(() => {
    //     const storedSessionId = localStorage.getItem("sessionId");
    //     if (storedSessionId) {
    //         setSessionId(storedSessionId);
    //     }
    // }, []);

    // // sessionIdが更新された時にローカルストレージに保存する
    // useEffect(() => {
    //     if (sessionId) {
    //         localStorage.setItem("sessionId", sessionId);
    //     }
    // }, [sessionId]);

    const readyUpPlayersList = readyUpPlayers.map((player) => (
        <li key={player.id}>
            {" "}
            {player.session_id === sessionId
                ? `${player.name}（あなた）`
                : player.name}{" "}
            が準備完了しました。
        </li>
    ));

    const handleReadyUp = async () => {
        try {
            const response = await axios.post(
                "/api/player/ready",
                {
                    name: playerName,
                    gameId: gameId,
                },
                {
                    headers: {
                        "X-Session-ID": sessionId,
                    },
                }
            );
            setSessionId(response.data.player.session_id);
            sessionStorage.setItem(
                "sessionId",
                response.data.player.session_id
            );
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

        const channel = pusher.subscribe("game." + gameId);
        channel.bind("game-started", function (data) {
            setGameStarted(true);
            setCurrentPlayer(data.currentPlayer);
            console.log(data);
            // サーバーから手札情報を取得する　コンソールで手札が確認できてしまう問題未解決
            // const fetchHandCards = async () => {
            //     try {
            //         const response = await axios.get(
            //             `/api/hand-cards/${gameId}`
            //         );
            //         setHandCards(response.data.cards);
            //         console.log(response.data.cards);
            //     } catch (error) {
            //         console.error("手札情報の取得に失敗しました。", error);
            //     }
            // };

            // fetchHandCards();
        });
        channel.bind("player-ready", (data) => {
            setReadyUpPlayers((prevPlayers) => [...prevPlayers, data.player]);
        });
        channel.bind("hand-cards", (data) => {
            // カードデータを受け取ったときの処理
            setHandCards(data.cards);
        });
        channel.bind("turn-advanced", (data) => {
            setCurrentPlayer(data.player);
            console.log(data.player);
        });
        channel.bind("orderd-fruits", (data) => {
            setOrderdFruits(data.orderdFruits);
        });
        channel.bind("called-master", (data) => {
            setGameStarted(false);
            setIsStockChecked(true);
        });
    }, []);

    useEffect(() => {
        // サーバーから現在のプレイヤーのリストを取得
        const fetchPlayersReady = async () => {
            try {
                const response = await axios.get(`/api/game/${gameId}/players`);
                setReadyUpPlayers(response.data.players);
            } catch (error) {
                console.error(error);
            }
        };

        // コンポーネントのマウント時にプレイヤーのリストを取得
        fetchPlayersReady();
    }, []);

    const startGame = async () => {
        try {
            const response = await axios.post(
                "/api/game/start",
                {
                    gameId: gameId,
                    playerCount: playerCount,
                },
                {
                    headers: {
                        "X-Session-ID": sessionId,
                    },
                }
            );
            setHandCards(response.data.handCards);
            setGameStarted(true);
            setCurrentPlayer(response.data.currentPlayer);
            setStockedItems(response.data.stockedItems);
            setOrderdCard(response.data.orderdCard);
            setOrderdFruits([]);
            setIsStockChecked(false);
            console.log(response.data.handCards);
            console.log(readyUpPlayers);
            console.log(response.data.currentPlayer);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOrderCard = async () => {
        try {
            const response = await axios.post("/api/game/orderCard", {
                gameId: gameId,
            });
            setOrderdCard(response.data.newOrderdCard);
            setDeck(response.data.deck);
            setDecided(false);
            console.log(orderdCard);
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
            setGameStarted(false);
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
                    <ul>{readyUpPlayersList}</ul>
                    <HandCards
                        cards={handCards}
                        players={readyUpPlayers}
                        check={isStockChecked}
                        session={sessionId}
                    />
                    <PrimaryButton
                        onClick={startGame}
                        className="ms-4"
                        disabled={
                            processing ||
                            readyUpPlayers.length !== playerCount ||
                            gameStarted
                        }
                    >
                        {isStockChecked ? "新しいゲーム" : "カードを配る"}
                    </PrimaryButton>
                    <SecondaryButton
                        onClick={handleOrderCard}
                        className="ms-4"
                        disabled={
                            processing ||
                            isStockChecked ||
                            currentPlayer.session_id !== sessionId
                        }
                    >
                        注文をとる
                    </SecondaryButton>
                    <SecondaryButton
                        onClick={callMaster}
                        className="ms-4"
                        disabled={
                            processing ||
                            isStockChecked ||
                            currentPlayer.session_id !== sessionId
                        }
                    >
                        店長を呼ぶ
                    </SecondaryButton>
                    <NewOrderdCard
                        gameId={gameId}
                        card={orderdCard}
                        selectedFruit={selectedFruit}
                        setSelectedFruit={setSelectedFruit}
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
