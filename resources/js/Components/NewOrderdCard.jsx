import React from "react";
import { getCardSymbol } from "../utils/cardHelpers";

const NewOrderdCard = (props) => {
    if (!props.card) return null; // props.cardが存在しない場合、何もレンダリングしない

    return (
        <div>
            <p>今回の注文</p>
            <img src={getCardSymbol(props.card)} />
        </div>
    );
};

export default NewOrderdCard;
