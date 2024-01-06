import React from "react";
import { getCardSymbol } from "../utils/cardHelpers";

const NewOrderdCard = (props) => {
    if (!props.card) return null; // props.cardが存在しない場合、何もレンダリングしない
    let firstFruit = "";
    let secondFruit = "";
    if (props.card.berry) {
        firstFruit = "🍓";
    }
    if (props.card.banana) {
        if (firstFruit) {
            secondFruit = "🍌";
        } else {
            firstFruit = "🍌";
        }
    }
    if (props.card.grape) {
        if (firstFruit) {
            secondFruit = "🍇";
        } else {
            firstFruit = "🍇";
        }
    }
    if (props.card.durian) {
        secondFruit = "🦔";
    }

    return (
        <div>
            <p>今回の注文</p>
            <img src={getCardSymbol(props.card)} />
            <p>どちらの注文をとるか選んでね</p>
            <button
                style={{
                    margin: "25px",
                    padding: "10px",
                    fontSize: "16px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                {firstFruit}
            </button>
            <button
                style={{
                    margin: "10px",
                    padding: "10px",
                    fontSize: "16px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                {secondFruit}
            </button>
        </div>
    );
};

export default NewOrderdCard;
