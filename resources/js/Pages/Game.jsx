import axios from "axios";
import HandCard from "@/Components/HandCard";
import NewOrderdCard from "@/Components/NewOrderdCard.jsx";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Link, Head } from "@inertiajs/react";
import { CARDS } from "../card.js";
import { useEffect, useState } from "react";
import { Grid, TextField } from "@mui/material";

export default function Game() {
    const processing = false;
    const player = 1;
    const [game, setGame] = useState("");
    const [handCard, setHandCard] = useState("");
    const [orderdCard, setOrderdCard] = useState("");
    const [orderdCards, setOrderdCards] = useState([]);
    const [stockedItems, setStockedItems] = useState({ b: 0, g: 0, y: 0 });
    const [isStockEmpty, setIsStockEmpty] = useState(true);
    const [isStockChecked, setIsStockChecked] = useState(false);
    const [deck, setDeck] = useState([]);

    useEffect(() => {
        if (stockedItems.b < 0 || stockedItems.g < 0 || stockedItems.y < 0) {
            console.log("stockedItems is empty");
            setIsStockEmpty(true);
        } else {
            console.log("stockedItems is not empty");
            setIsStockEmpty(false);
        }
    }, [stockedItems]);

    const startGame = async () => {
        try {
            const response = await axios.post("/api/game/start");
            console.log(
                response.data.handCards,
                response.data.stockedItems,
                response.data.deck
            );
            setGame(response.data.game);
            setHandCard(response.data.handCards);
            setDeck(response.data.deck);
            setStockedItems(response.data.stockedItems);
            setOrderdCard(response.data.orderdCard);
            setIsStockChecked(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOrderCard = async () => {
        try {
            console.log(deck);
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

    const checkStock = () => {
        let totalB = 0;
        let totalG = 0;
        let totalY = 0;
        orderdCards.forEach((cardId) => {
            const card = CARDS.find((card) => card.id === cardId);
            totalB += card.item.b;
            totalG += card.item.g;
            totalY += card.item.y;
        });
        setStockedItems({
            b: stockedItems.b - totalB,
            g: stockedItems.g - totalG,
            y: stockedItems.y - totalY,
        });
        setIsStockChecked(true);
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
                        onClick={checkStock}
                        className="ms-4"
                        disabled={processing || isStockChecked}
                    >
                        店長を呼ぶ
                    </SecondaryButton>
                    <NewOrderdCard card={orderdCard} />
                </Grid>
                <Grid item xs={6}>
                    {orderdCards.length > 0 && (
                        <div>
                            <p>注文されたカード:</p>
                            {orderdCards.map((cardId, index) => {
                                const card = CARDS.find(
                                    (card) => card.id === cardId
                                );
                                const cardSymbol = card
                                    ? card.symbol
                                    : "カードが見つかりません";
                                return <p key={index}>{`${cardSymbol}`}</p>;
                            })}
                        </div>
                    )}
                </Grid>
            </Grid>
            {isStockChecked &&
                (isStockEmpty ? (
                    <div>
                        <p>ナイス！補充するね</p>
                    </div>
                ) : (
                    <div>まだ在庫あるじゃん！！</div>
                ))}
        </>
    );
}
