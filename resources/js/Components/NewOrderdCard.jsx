import { CARDS } from "../card.js";
import React from "react";

const NewOrderdCard = (props) => {
    if (!props.card) return null; // props.cardが存在しない場合、何もレンダリングしない
    const cardSymbol = CARDS.find((card) => card.id === props.card).symbol;
    return (
        <div>
            <p>今回の注文</p>
            <p>{cardSymbol}</p>
        </div>
    );
};

export default NewOrderdCard;
