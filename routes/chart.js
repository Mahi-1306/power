const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
//console.log('✅ chart.js loaded');

/* router.get('/', (req, res) => {
  res.send('Chart route working');
}); */

router.get('/chart-data', async (req, res) => {
 
    const start_date = '2025-05-28'; // Correct format
  const end_date = '2025-05-30';
  try {
    const data = await prisma.$queryRaw`
      SELECT date,sum(CAST(data AS DECIMAL(10,2))) as data
      FROM machinedata
      WHERE date between ${start_date} and ${end_date}
      group by date;
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
      SELECT DATE_FORMAT(date, '%Y-%m') AS month, 
         SUM(CAST(data AS DECIMAL(10,2))) AS total
  FROM machinedata
  GROUP BY month
  ORDER BY month;
    `;

    res.json(data);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = router;
