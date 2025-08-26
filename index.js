const express = require('express');
const cors = require('cors');
const app = express();
const aiRoutes = require('./src/routes/ai.routes')
require('dotenv').config();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', aiRoutes)


app.listen(8080, () => {
    console.log(`Server Running On ${8080}.`)
})
// const { GoogleGenAI } = require('@google/genai');
// const { customPrompt } = require('./src/utils/prompt');

// const ai = new GoogleGenAI({ apiKey: 'AIzaSyAhC8txXjPgQWucmUlUQR8KeHnr7gWt0PE' });

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "",
//     config: {
//       thinkingConfig: {
//         thinkingBudget: 0, // Disables thinking
//         systemInstruction: [customPrompt]
//       },
//     }
//   });
//   console.log(response.text);
// }

// main();