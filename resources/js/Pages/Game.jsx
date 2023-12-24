import HandCard from "@/Components/HandCard";
import NewOrderdCard from "@/Components/NewOrderdCard.jsx";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Link, Head } from "@inertiajs/react";
import { CARDS } from "../card.js";
import { useState } from "react";
import { Grid, TextField } from "@mui/material";

export default function Game() {
    const processing = false;
    const player = 1;
    const [handCard, setHandCard] = useState("");
    const [orderdCard, setOrderdCard] = useState("");
    const [orderdCards, setOrderdCards] = useState([]);
    const [stockedItems, setStockedItems] = useState({ b: 0, g: 0, y: 0 });
    const [isStockEmpty, setIsStockEmpty] = useState(true);
    const [isStockChecked, setIsStockChecked] = useState(false);
    const [shuffledCards, setShuffledCards] = useState([]);

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 子コンポーネントに渡す関数
    const handleHandCard = () => {
        const newShuffledCards = shuffle([...CARDS]);
        const handCards = newShuffledCards.slice(0, 4).map((card) => card.id);
        setHandCard(handCards);

        setIsStockChecked(false);

        // 手札のカードの記号の合計を計算
        let totalB = 0;
        let totalG = 0;
        let totalY = 0;
        handCards.forEach((cardId) => {
            const card = CARDS.find((card) => card.id === cardId);
            totalB += card.item.b;
            totalG += card.item.g;
            totalY += card.item.y;
        });

        // stockedItemsを更新
        setStockedItems({ b: totalB, g: totalG, y: totalY });
        newShuffledCards.splice(0, 4); // 配られたカードを配列から削除
        setShuffledCards(newShuffledCards);
        setOrderdCards([]);
    };
    const handleOrderdCard = () => {
        if (shuffledCards.length > 0) {
            if (orderdCard) {
                setOrderdCards((prevOrderdCards) => [
                    ...prevOrderdCards,
                    orderdCard,
                ]);
            }
            const newOrderdCard = shuffledCards[0].id;
            setOrderdCard(newOrderdCard);
            shuffledCards.splice(0, 1); // 配られたカードを配列から削除
        } else {
            console.error("shuffledCards is empty");
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
        if (stockedItems.b < 0 || stockedItems.g < 0 || stockedItems.y < 0) {
            console.log("stockedItems is empty");
            setIsStockEmpty(false);
        } else {
            console.log("stockedItems is not empty");
            setIsStockEmpty(true);
        }
    };

    return (
        <>
            <Head title="Welcome" />
            <Grid container columnGap={10}>
                <Grid item sx={4}>
                    <HandCard card={handCard} player={player} />
                    <PrimaryButton
                        onClick={handleHandCard}
                        className="ms-4"
                        disabled={processing}
                    >
                        カードを配る
                    </PrimaryButton>
                    <SecondaryButton
                        onClick={handleOrderdCard}
                        className="ms-4"
                        disabled={processing}
                    >
                        注文をとる
                    </SecondaryButton>
                    <SecondaryButton
                        onClick={checkStock}
                        className="ms-4"
                        disabled={processing}
                    >
                        店長を呼ぶ
                    </SecondaryButton>
                    <NewOrderdCard card={orderdCard} />
                </Grid>
                <Grid item sx={8}>
                    {orderdCards.length > 0 && (
                        <div>
                            <p>注文されたカード:</p>
                            {orderdCards.map((cardId, index) => {
                                const cardSymbol = CARDS.find(
                                    (card) => card.id === cardId
                                ).symbol;
                                return <p key={index}>{`${cardSymbol}`}</p>;
                            })}
                        </div>
                    )}
                </Grid>
            </Grid>
            {isStockChecked &&
                (isStockEmpty ? (
                    <div>
                        <p>まだ在庫あるじゃん！！</p>
                    </div>
                ) : (
                    <div>ナイス！補充するね</div>
                ))}
            {isStockChecked && (
                <PrimaryButton
                    onClick={handleHandCard}
                    className="ms-4"
                    disabled={processing}
                >
                    新しいゲーム
                </PrimaryButton>
            )}
        </>
    );
}
