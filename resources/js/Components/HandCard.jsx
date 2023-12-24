import React from "react";
import { CARDS } from "../card.js";

const HandCard = (props) => {
    const generatedCard = Array.isArray(props.card) ? props.card : [];
    return (
        <div>
            {generatedCard.map((cardId, index) => {
                const playerNumber = index + 1; // プレイヤー番号を取得
                const cardSymbol = CARDS.find(
                    (card) => card.id === cardId
                ).symbol;
                return (
                    <p key={index}>
                        {props.player === playerNumber && props.check === false
                            ? "？？？あなた"
                            : `${cardSymbol}プレイヤー${playerNumber}`}
                    </p>
                );
            })}
        </div>
    );
};

export default HandCard;
