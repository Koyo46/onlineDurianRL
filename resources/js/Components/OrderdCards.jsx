import React from "react";
import { getCardSymbol } from "../utils/cardHelpers";

const NewOrderdCard = (props) => {
    if (!props.cards) return null; // props.cardが存在しない場合、何もレンダリングしない

    return (
        <div>
            <p>注文されたカード:</p>
            {props.cards.map((card, index) => {
                return <img src={getCardSymbol(card)} />;
            })}
        </div>
    );
};

export default NewOrderdCard;
