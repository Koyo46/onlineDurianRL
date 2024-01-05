import React from "react";
import { CARDS } from "../card.js";

const HandCard = (props) => {
    const generatedCard = Array.isArray(props.card) ? props.card : [];
    console.log(generatedCard);
    return (
        <div>
            {generatedCard.map((cardObj, index) => {
                const playerNumber = index + 1; // プレイヤー番号を取得
                const card = CARDS.find((card) => card.id === cardObj.id);
                const cardSymbol = card
                    ? card.symbol
                    : "カードが見つかりません";
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
