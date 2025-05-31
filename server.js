

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./utils/authRoutes');
const machinedataroutes=require('./routes/machinedataroutes');
const machineroute=require('./routes/machine');
const chartroute=require('./routes/chart')
require('dotenv').config();
 

const app = express();
app.use(morgan('dev'))
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/machinedataroute',machinedataroutes)
app.use('/chartroute',chartroute)
app.use('/machineroute',machineroute)
app.use("/", ()=> {return {"msg":"Hello World"}})
app.listen(3001," 192.168.163.7", () => {
    console.log('Server running on http://localhost:3001');
});
