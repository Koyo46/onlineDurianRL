import React, { useState } from "react";
import { getCardSymbol } from "../utils/cardHelpers";

const NewOrderdCard = (props) => {
    const [selectedFruit, setSelectedFruit] = useState("");
    if (!props.card) return null; // props.cardが存在しない場合、何もレンダリングしない
    const fruits = {
        berry: "🍓",
        banana: "🍌",
        grape: "🍇",
        durian: "🦔",
    };

    let [firstFruit, secondFruit] = Object.entries(fruits)
        .filter(([key]) => props.card[key])
        .map(([key, icon]) => ({ name: key, icon: icon }));

    const decideOrder = async () => {
        try {
            const response = await axios.post("/api/game/decideOrder", {
                orderdFruits: props.orderdFruits,
                card: props.card,
                fruit: selectedFruit,
            });
            // Handle response here
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <p>今回の注文</p>
            <img src={getCardSymbol(props.card)} />
            <p>どちらの注文をとるか選んでね</p>
            <button
                onClick={() => {
                    decideOrder();
                    setSelectedFruit(firstFruit.name);
                }}
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
                {firstFruit.icon}
            </button>
            <button
                onClick={() => {
                    decideOrder();
                    setSelectedFruit(secondFruit.name);
                }}
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
                {secondFruit.icon}
            </button>
        </div>
    );
};

export default NewOrderdCard;
