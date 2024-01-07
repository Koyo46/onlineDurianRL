import React, { useEffect, useState } from "react";
import { getCardSymbol } from "../utils/cardHelpers";
import { fruits } from "../utils/fruits";

const NewOrderdCard = ({
    card,
    orderdFruits,
    setOrderdFruits,
    decided,
    setDecided,
}) => {
    if (!card || decided) {
        setDecided;
        return null;
    }

    const decideOrder = async (selectedFruitId) => {
        try {
            const response = await axios.post("/api/game/decideOrder", {
                card: card,
                selectedFruitId: selectedFruitId,
            });
            // Orderd Fruitsコンポーネントでレンダリングするための処理を追加
            setOrderdFruits(response.data.orderdFruits);
            console.log(response.data.orderdFruits);
            setDecided(true);
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
                    decideOrder(1);
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
                {fruits[card["fruit1"]]}
            </button>
            <button
                onClick={() => {
                    decideOrder(2);
                }}
                style={{
                    margin: "10px",
                    padding: "10px",
                    fontSize: "16px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                {fruits[card["fruit2"]]}
            </button>
        </div>
    );
};

export default NewOrderdCard;
