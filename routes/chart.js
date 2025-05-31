const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//console.log('✅ chart.js loaded');

/* router.get('/', (req, res) => {
  res.send('Chart route working');
}); */

router.get('/chart-data', async (req, res) => {
 
    const start_date = '2025-05-25'; // Correct format
  const end_date = '2025-05-31';
  try {
   const data = await prisma.$queryRaw`
  SELECT 
    DATE(date) as date, 
  
    SUM(CAST(data AS DECIMAL(10,2))) as data
  FROM machinedata
  WHERE DATE(date) BETWEEN ${start_date} AND ${end_date}
  GROUP BY DATE(date);
`;

    res.json(data);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/chart-data/mon', async (req, res) => {
  try {
    const data = await prisma.$queryRaw`
      SELECT DATE_FORMAT(date, '%b') AS month, 
             SUM(CAST(data AS DECIMAL(10,2))) AS total
      FROM machinedata
      GROUP BY month
      ORDER BY STR_TO_DATE(month, '%b');
    `;

    res.json(data);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/chart-data-day', async (req, res) => {
  const start_date = '2025-05-25';
  const end_date = '2025-05-30';

  try {
    const data = await prisma.$queryRaw`
      SELECT 
        DATE_FORMAT(date, '%a') AS day,  -- %a gives abbreviated weekday name (e.g., Mon)
        SUM(CAST(data AS DECIMAL(10,2))) AS data
      FROM machinedata
      WHERE date BETWEEN ${start_date} AND ${end_date}
      GROUP BY day
      ORDER BY FIELD(day, 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');  -- optional ordering
    `;

    res.json(data);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
