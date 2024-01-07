import axios from "axios";
import HandCard from "@/Components/HandCard";
import NewOrderdCard from "@/Components/NewOrderdCard.jsx";
import OrderdFruits from "@/Components/OrderdFruits.jsx";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Link, Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Grid, TextField } from "@mui/material";
import { getCardSymbol } from "../utils/cardHelpers.js";

export default function Game() {
    const processing = false;
    const player = 1;
    const [game, setGame] = useState("");
    const [handCard, setHandCard] = useState("");
    const [orderdCard, setOrderdCard] = useState("");
    const [orderdFruits, setOrderdFruits] = useState([]);
    const [decided, setDecided] = useState(true);
    const [stockedItems, setStockedItems] = useState([]);
    const [isStockEmpty, setIsStockEmpty] = useState(true);
    const [isStockChecked, setIsStockChecked] = useState(false);
    const [deck, setDeck] = useState([]);
    const [selectedFruit, setSelectedFruit] = useState(""); // Added state for selectedFruit

    const startGame = async () => {
        try {
            const response = await axios.post("/api/game/start");
            setGame(response.data.game);
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

    useEffect(() => {
        console.log(handCard, orderdCard);
    }, [handCard, orderdCard]);

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
                    <HandCard
                        card={handCard}
                        player={player}
                        check={isStockChecked}
                    />
                    <PrimaryButton
                        onClick={startGame}
                        className="ms-4"
                        disabled={processing}
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
            </Grid>
        </>
    );
}
