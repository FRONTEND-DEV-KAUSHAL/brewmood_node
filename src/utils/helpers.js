const fs = require('fs');

function extractJsonFromText(text) {
    console.log(text,":::::::::")
    const regex = /\*\*Action\*\*:\s*(\{.*?\})\s*\*\*PAUSE\*\*/s;
    const match = text.match(regex);

    if (match) {
        const jsonStr = match[1];
        try {
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error("Failed to parse JSON:", error);
            return null;
        }
    } else {
        console.log("No valid JSON block found.");
        return null;
    }
}

function saveUnknownMood(mood, filePath = "moods.json") {
    mood = mood.toLowerCase();

    let existing = [];
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        existing = JSON.parse(data);
    }

    if (!existing.includes(mood)) {
        existing.push(mood);
        fs.writeFileSync(filePath, JSON.stringify(existing, null, 4));
        console.log(`New mood '${mood}' saved to moods.json`);
    } else {
        console.log(`Mood '${mood}' already exists in moods.json`);
    }
}

function getCoffeeRecipes(mood) {
    mood = mood.toLowerCase();
    switch (mood) {
        case "happy":
            return "Iced Caramel Latte";
        case "sad":
            return "Mocha with extra chocolate";
        case "tired":
            return "Espresso shot";
        case "excited":
            return "Cold Brew with lemon";
        case "lonely":
            return "Coffechino";
        case "angry":
            return "Flat White with oat milk";
        case "anxious":
            return "Decaf Chamomile Latte";
        case "stressed":
            return "Vanilla Lavender Latte";
        case "relaxed":
            return "Hazelnut Flat White";
        case "bored":
            return "Affogato (espresso over ice cream)";
        case "confident":
            return "Macchiato";
        case "romantic":
            return "Rose Latte";
        case "nostalgic":
            return "Turkish Coffee";
        case "playful":
            return "Peppermint Mocha";
        case "focused":
            return "Americano";
        case "creative":
            return "Spanish Latte";
        case "lazy":
            return "Iced Coffee with cream";
        case "determined":
            return "Doppio (double espresso)";
        case "hopeful":
            return "Cinnamon Cappuccino";
        case "curious":
            return "Nitro Cold Brew";
        default:
            saveUnknownMood(mood);
            return "Classic Cappuccino";
    }
}

function cleanAnswerText(responseText) {
    const answerMatch = responseText.match(/\*\*Answer\*\*: (.+?)\n/);
    const answer = answerMatch ? answerMatch[1].trim() : "";

    const ingredientsMatch = responseText.match(/\*\*Ingredients\*\*:\n(.*?)\n\n/s);
    const ingredientsList = ingredientsMatch ? ingredientsMatch[1].trim().split('\n').map(line => line.replace(/^\*\s*/, '').trim()).filter(line => line) : [];

    const instructionsMatch = responseText.match(/\*\*Instructions\*\*:\n(.*?)$/s);
    const instructionsList = instructionsMatch ? instructionsMatch[1].trim().split('\n').map(line => line.replace(/^\d+\.\s*/, '').trim()).filter(line => line) : [];

    const data = {
        answer: answer,
        recipe: {
            ingredients: ingredientsList,
            instructions: instructionsList
        }
    };
    return JSON.stringify(data, null, 4);
}

module.exports = {extractJsonFromText, cleanAnswerText, getCoffeeRecipes}