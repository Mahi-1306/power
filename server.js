

const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const authRoutes = require('./utils/authRoutes'); // 👈 adjust path as needed
require('dotenv').config();
 

const app = express();
app.use(morgan('dev'))
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
