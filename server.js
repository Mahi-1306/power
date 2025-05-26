// src/server.js

const express = require('express');
const cors=require('cors');
const app = express();
const machineRoutes=require('./routes/machine');

app.use(cors());
app.use(express.json());

app.use('/machines', machineRoutes); // 👈 Use the route


app.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
