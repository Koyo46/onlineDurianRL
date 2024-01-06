import React from "react";
import { getCardSymbol } from "../utils/cardHelpers";

const OrderdFruits = (props) => {
    if (!props.cards) return null; // props.cardが存在しない場合、何もレンダリングしない

    return (
        <div>
            <p>　　❌　　⭕️</p>
            {props.cards.map((card, index) => {
                return <img key={index} src={getCardSymbol(card)} />;
            })}
        </div>
    );
};

export default OrderdFruits;
