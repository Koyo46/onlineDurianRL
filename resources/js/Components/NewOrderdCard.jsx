import React, { useEffect, useState } from "react";
import { getCardSymbol } from "../utils/cardHelpers";
import { fruits } from "../utils/fruits";

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
        return null;
    }

    let [firstFruit, secondFruit] = Object.entries(fruits)
        .filter(([key]) => card[key])
        .map(([key]) => key);

    const decideOrder = async (fruit) => {
        try {
            const response = await axios.post("/api/game/decideOrder", {
                card: card,
                fruit: fruit,
                orderdFruits: orderdFruits,
            });
            setOrderdFruits(response.data.orderdFruits);
            setDecided(true);
            console.log(response.data.orderdFruits);
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
                    setSelectedFruit(firstFruit);
                    decideOrder(firstFruit);
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
                {fruits[firstFruit]}
            </button>
            <button
                onClick={() => {
                    setSelectedFruit(secondFruit);
                    decideOrder(secondFruit);
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
                {fruits[secondFruit]}
            </button>
        </div>
    );
};

export default NewOrderdCard;
