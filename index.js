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
});