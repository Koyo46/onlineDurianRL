export function getCardSymbol(card) {
    let cardSymbol = "";

    if (card) {
        if (card.berry > 0) {
            cardSymbol += "🍓".repeat(card.berry);
        }
        if (card.banana > 0) {
            cardSymbol += "🍌".repeat(card.banana);
        }
        if (card.grape > 0) {
            cardSymbol += "🍇".repeat(card.grape);
        }
        if (card.durian > 0) {
            cardSymbol += "🦔".repeat(card.durian);
        }
    }

    return cardSymbol;
}
