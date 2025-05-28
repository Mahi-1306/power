

const express = require('express');
const cors = require('cors');
const authRoutes = require('./utils/authRoutes'); // 👈 adjust path as needed

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
