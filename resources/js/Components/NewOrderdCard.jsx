import React, { useEffect, useState } from "react";
import { getCardSymbol } from "../utils/cardHelpers";

const NewOrderdCard = ({
    card,
    selectedFruit,
    setSelectedFruit,
    orderdFruits,
    setOrderdFruits,
    decided,
    setDecided,
}) => {
    if (!card || decided) {
        setDecided;
        return null; // props.cardが存在しない場合、何もレンダリングしない
    }

    const fruits = {
        berry: "🍓",
        banana: "🍌",
        grape: "🍇",
        durian: "🦔",
    };

    let [firstFruit, secondFruit] = Object.entries(fruits)
        .filter(([key]) => card[key])
        .map(([key, icon]) => ({ name: key, icon: icon }));

    const decideOrder = async () => {
        try {
            const response = await axios.post("/api/game/decideOrder", {
                card: card,
                fruit: selectedFruit,
                orderdFruits: orderdFruits,
            });
            setOrderdFruits(response.data.orderdFruits);
            setDecided(true);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <p>今回の注文</p>
            <img src={getCardSymbol(card)} />
            <p>どちらの注文をとるか選んでね</p>
            <button
                onClick={() => {
                    decideOrder();
                    setSelectedFruit(firstFruit);
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
                    setSelectedFruit(secondFruit);
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
