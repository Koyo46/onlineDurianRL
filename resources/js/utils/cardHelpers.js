export function getCardSymbol(card) {
    let cardSymbol = "";

    let canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 50;
    let ctx = canvas.getContext("2d");
    let firstFruitDrawn = false;
    if (!card) {
        ctx.fillText("?", 25, 25);
        ctx.fillText("?", 75, 25);
        cardSymbol = canvas.toDataURL();
        return cardSymbol;
    }
    if (card.berry > 0) {
        ctx.fillText("🍓".repeat(card.berry), 25, 25);
        firstFruitDrawn = true;
    }
    if (card.banana > 0) {
        ctx.fillText("🍌".repeat(card.banana), firstFruitDrawn ? 75 : 25, 25);
        firstFruitDrawn = true;
    }
    if (card.grape > 0 && !firstFruitDrawn) {
        ctx.fillText("🍇".repeat(card.grape), 25, 25);
        firstFruitDrawn = true;
    } else if (card.grape > 0) {
        ctx.fillText("🍇".repeat(card.grape), 75, 25);
    }
    if (card.durian > 0 && !firstFruitDrawn) {
        ctx.fillText("🦔".repeat(card.durian), 25, 25);
    } else if (card.durian > 0) {
        ctx.fillText("🦔".repeat(card.durian), 75, 25);
    }
    cardSymbol = canvas.toDataURL();

    return cardSymbol;
}
