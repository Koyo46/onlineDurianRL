import HandCard from "@/Components/HandCard";
import NewOrderdCard from "@/Components/NewOrderdCard.jsx";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Link, Head } from "@inertiajs/react";
import { CARDS } from "../card.js";
import { useState } from "react";
import { Grid } from "@mui/material";

export default function Game() {
    const processing = false;
    const player = 1;
    const [handCard, setHandCard] = useState("");
    const [orderdCard, setOrderdCard] = useState("");
    const [orderdCards, setOrderdCards] = useState([]);
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

    return (
        <>
            <Head title="Welcome" />
            <Grid container>
                <Grid item sx={6}>
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
                    <SecondaryButton className="ms-4" disabled={processing}>
                        店長を呼ぶ
                    </SecondaryButton>
                    <NewOrderdCard card={orderdCard} />
                </Grid>
                <Grid item sx={6}>
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
        </>
    );
}
