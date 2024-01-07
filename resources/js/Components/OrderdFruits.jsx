import React from "react";
import { getCardSymbol } from "../utils/cardHelpers";

const OrderdFruits = (props) => {
    if (!props.orderdFruits) return null; // props.orderdFruitsが存在しない場合、何もレンダリングしない

    return (
        <div>
            {props.orderdFruits.map((card, index) => {
                return <img key={index} src={getCardSymbol(card)} />;
            })}
        </div>
    );
};

export default OrderdFruits;
