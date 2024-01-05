import React from "react";
import { getCardSymbol } from "../utils/cardHelpers";

const HandCard = (props) => {
    const generatedCard = Array.isArray(props.card) ? props.card : [];
    return (
        <div>
            {generatedCard.map((cardObj, index) => {
                const playerNumber = index + 1; // プレイヤー番号を取得
                const cardSymbol = getCardSymbol(cardObj);
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
