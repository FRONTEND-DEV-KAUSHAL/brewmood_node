const { GoogleGenAI, Type } = require('@google/genai');
const {systemPrompt} = require('../utils/prompt');
const { extractJsonFromText, getCoffeeRecipes } = require('../utils/helpers');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const fetchCoffeeRecepies = {
  name: 'get_coffee_recepies',
  description: "Returns coffee recipes based on the user's current mood.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      mood: {
        type: Type.STRING,
        description: 'a suitable coffee recipe, e.g. for a "happy" mood',
      },
    },
    required: ['mood'],
  },
}

const callModel = async (req, res) => {
  try {
    const { message } = req.body;
    // system prompts are passed as a "user" part or in "system_instruction"
    let messages = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      {
        role: "user",
        parts: [{ text: message }]
      }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
      system_instruction: { role: "system", parts: [{ text: systemPrompt }] }, // optional
      config: {
        tools: [
          {
            functionDeclarations: [fetchCoffeeRecepies]
          }
        ]
      }
    });
    console.log(response.functionCalls)
    // console.log(extractJsonFromText(initialResponse.data))
    // function call handling
    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionCall = response.functionCalls[0];
      console.log(`Function to call: ${functionCall.name}`);
      console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
      if (functionCall.name === 'get_coffee_recepies') {
        const coffeeSuggest = getCoffeeRecipes(functionCall.args["mood"]);
      
        // response.text() instead of response.text
        messages.push({ role: "assistant", parts: [{ text: response.text }] });
        messages.push({
          role: "user",
          parts: [{ text: `**Action_Response**: ${coffeeSuggest}` }]
        });
      
        const finalResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: messages,
          system_instruction: { role: "system", parts: [{ text: systemPrompt }] },
          config: {
            tools: [
              {
                functionDeclarations: [fetchCoffeeRecepies]
              }
            ]
          }
        });
      
        console.log(finalResponse.text(), "coffeeSuggest");
      }
    } else {
      console.log("No function call found in the response.");
      // console.log(response.text);
    }

    // return res.json({ result: response.text });
  } catch (e) {
    console.error(e.message);
    res.json({ result: e.message });
  }
};

module.exports = { callModel };