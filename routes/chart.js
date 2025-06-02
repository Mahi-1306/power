const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

router.get("/data", async (req, res) => {
  try {
    let { startDate, endDate, groupBy } = req.query;

    // Default to today if not provided
    if (!startDate || !endDate) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      startDate = `${yyyy}-${mm}-${dd}T00:00:00.000Z`;
      endDate = `${yyyy}-${mm}-${dd}T23:59:59.999Z`;
    }

    groupBy = groupBy ? groupBy.toLowerCase() : "day";
    let data = [];

    if (groupBy === "month") {
      data = await prisma.$queryRaw`
        SELECT DATE_FORMAT(date, '%Y-%m') AS period,
               SUM(CAST(data AS DECIMAL(10,2))) AS total
        FROM machinedata
        WHERE date BETWEEN ${new Date(startDate)} AND ${new Date(endDate)}
        GROUP BY period
        ORDER BY period;
      `;
    } else if (groupBy === "year") {
      data = await prisma.$queryRaw`
        SELECT DATE_FORMAT(date, '%Y') AS period,
               SUM(CAST(data AS DECIMAL(10,2))) AS total
        FROM machinedata
        WHERE date BETWEEN ${new Date(startDate)} AND ${new Date(endDate)}
        GROUP BY period
        ORDER BY period;
      `;
    } else {
      // Default to daily
      data = await prisma.$queryRaw`
        SELECT DATE(date) AS period,
               SUM(CAST(data AS DECIMAL(10,2))) AS total
        FROM machinedata
        WHERE date BETWEEN ${new Date(startDate)} AND ${new Date(endDate)}
        GROUP BY period
        ORDER BY period;
      `;
    }

    res.json({
      startDate,
      endDate,
      data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
