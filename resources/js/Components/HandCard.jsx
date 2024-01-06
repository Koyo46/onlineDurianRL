import React from "react";
import { getCardSymbol } from "../utils/cardHelpers";
import { Grid } from "@mui/material";

const HandCard = (props) => {
    const generatedCard = Array.isArray(props.card) ? props.card : [];
    return (
        <div>
            {generatedCard.map((cardObj, index) => {
                const playerNumber = index + 1; // プレイヤー番号を取得
                return (
                    <div key={index}>
                        {props.player === playerNumber &&
                        props.check === false ? (
                            <Grid container>
                                <Grid item>
                                    <img src={getCardSymbol(null)} />
                                </Grid>
                                <Grid item>{`あなた`}</Grid>
                            </Grid>
                        ) : (
                            <Grid container>
                                <Grid item>
                                    <img src={getCardSymbol(cardObj)} />
                                </Grid>
                                <Grid item>{`プレイヤー${playerNumber}`}</Grid>
                            </Grid>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default HandCard;
