import axios from "axios";
import HandCard from "@/Components/HandCard";
import NewOrderdCard from "@/Components/NewOrderdCard.jsx";
import OrderdCards from "@/Components/OrderdCards.jsx";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Link, Head } from "@inertiajs/react";
import { CARDS } from "../card.js";
import { useEffect, useState } from "react";
import { Grid, TextField } from "@mui/material";
import { getCardSymbol } from "../utils/cardHelpers.js";

export default function Game() {
    const processing = false;
    const player = 1;
    const [game, setGame] = useState("");
    const [handCard, setHandCard] = useState("");
    const [orderdCard, setOrderdCard] = useState("");
    const [orderdCards, setOrderdCards] = useState([]);
    const [stockedItems, setStockedItems] = useState([]);
    const [isStockEmpty, setIsStockEmpty] = useState(true);
    const [isStockChecked, setIsStockChecked] = useState(false);
    const [deck, setDeck] = useState([]);

    const startGame = async () => {
        try {
            const response = await axios.post("/api/game/start");
            setGame(response.data.game);
            setHandCard(response.data.handCards);
            setDeck(response.data.deck);
            setStockedItems(response.data.stockedItems);
            setOrderdCard(response.data.orderdCard);
            setOrderdCards([]);
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
                orderdCards: orderdCards,
            });
            setOrderdCard(response.data.newOrderdCard);
            setOrderdCards(response.data.orderdCards);
            setDeck(response.data.deck);
        } catch (error) {
            console.error(error);
        }
    };

    const callMaster = async () => {
        try {
            const response = await axios.post("/api/game/callMaster", {
                orderdCards: orderdCards,
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
                    <NewOrderdCard card={orderdCard} />
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
                    <OrderdCards cards={orderdCards} />
                </Grid>
            </Grid>
        </>
    );
}
