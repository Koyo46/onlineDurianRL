import React from "react";
import { getCardSymbol } from "../utils/cardHelpers";

const OrderdFruits = (props) => {
    return (
        <div>
            {props.orderdFruits.map((card, index) => {
                return <img key={index} src={getCardSymbol(card)} />;
            })}
        </div>
    );
};

export default OrderdFruits;
