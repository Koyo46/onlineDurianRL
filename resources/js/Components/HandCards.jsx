import React from "react";
import { getCardSymbol } from "../utils/cardHelpers";
import { Grid } from "@mui/material";

const HandCards = (props) => {
    const generatedCard = Array.isArray(props.cards) ? props.cards : [];
    return (
        <div>
            {generatedCard.map((cardObj, index) => {
                return (
                    <div key={index}>
                        {sessionStorage.getItem("sessionId") ===
                            props.players[index].session_id &&
                        props.check === false ? (
                            <Grid container>
                                <Grid item>
                                    <img src={getCardSymbol(null)} />
                                </Grid>
                                <Grid
                                    item
                                >{`${props.players[index].name}（あなた）`}</Grid>
                            </Grid>
                        ) : (
                            <Grid container>
                                <Grid item>
                                    <img src={getCardSymbol(cardObj)} />
                                </Grid>
                                <Grid
                                    item
                                >{`${props.players[index].name}`}</Grid>
                            </Grid>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default HandCards;
