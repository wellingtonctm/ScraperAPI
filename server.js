const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
require('./src/Routes/index')(app);
app.listen(3000);