import { fruits } from "../utils/fruits";

export function getCardSymbol(card) {
    let cardSymbol = "";

    let canvas = document.createElement("canvas");
    canvas.width = 150;
    canvas.height = 50;
    let ctx = canvas.getContext("2d");
    if (!card) {
        ctx.fillText("?", 25, 25);
        ctx.fillText("?", 75, 25);
        cardSymbol = canvas.toDataURL();
        return cardSymbol;
    }

    if (card.selected_fruit === 1) {
        // fruit1を右半分に描画
        for (let i = 0; i < card.fruit1_count; i++) {
            ctx.fillText(fruits[card.fruit1], 75 + i * 10, 25);
        }

        // fruit2を左半分に描画
        for (let i = 0; i < card.fruit2_count; i++) {
            ctx.fillText(fruits[card.fruit2], 25 + i * 10, 25);
        }
    } else if (card.selected_fruit === 2) {
        // fruit1を左半分に描画
        for (let i = 0; i < card.fruit1_count; i++) {
            ctx.fillText(fruits[card.fruit1], 25 + i * 10, 25);
        }

        // fruit2を右半分に描画
        for (let i = 0; i < card.fruit2_count; i++) {
            ctx.fillText(fruits[card.fruit2], 75 + i * 10, 25);
        }
    } else {
        // fruit1を右半分に描画
        for (let i = 0; i < card.fruit1_count; i++) {
            ctx.fillText(fruits[card.fruit1], 25 + i * 10, 25);
        }

        // fruit2を左半分に描画
        for (let i = 0; i < card.fruit2_count; i++) {
            ctx.fillText(fruits[card.fruit2], 75 + i * 10, 25);
        }
    }

    cardSymbol = canvas.toDataURL();
    return cardSymbol;
}
