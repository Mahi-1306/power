const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

const prisma = new PrismaClient();

//router.use(verifyToken)

router.post("/add", async (req, res) => {
  const { machine_id, Date: dateString ,data} = req.body;

  let parsedDate = null;
  if (dateString) {
    parsedDate = new Date(dateString);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }
  }

  try {
    const result = await prisma.machinedata.create({
      data: {
        machine_id:parseInt(machine_id),
        date: parsedDate||new Date(),
        data:data,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const data = await prisma.machinedata.findMany();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getbyid/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const data = await prisma.machinedata.findUnique({
      where: { data_id: id },
    });

    if (!data) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getbyname/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const rawData = await prisma.machinedata.findMany({
      where: {
        machine: {
          machine_name: {
            contains: name
          },
        },
      },
      include: {
        machine: {
          select: {
            machine_name: true,
          },
        },
      },
    });

    if (rawData.length === 0) {
      return res.status(404).json({ error: "No data found for this machine name" });
    }

    const formattedData = rawData.map(entry => ({
      machine_name: entry.machine.machine_name,
      data: entry.data,
      date: entry.date,
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

 router.get("/bydate", async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');

      startDate = `${yyyy}-${mm}-${dd}T00:00:00.000Z`;
      endDate = `${yyyy}-${mm}-${dd}T23:59:59.999Z`;
    }

    
    const data = await prisma.machinedata.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        }
      }
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}); 



router.put("/update/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { machine_id, Date: dateString } = req.body;

  let parsedDate = null;
  if (dateString) {
    parsedDate = new Date(dateString);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }
  }

  try {
    const updated = await prisma.machinedata.update({
      where: { id: id },
      data: {
        machine: {
          connect: { id: machine_id }, // connect via relation
        },
        date: parsedDate,
      },
    });

    res.json(updated);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(500).json({ error: error.message });
  }
});


router.delete("/delete/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.machinedata.delete({
      where: { data_id: id },
    });
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(500).json({ error: error.message });
  }
});
router.get('/api/machinedata', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const data = await prisma.machinedata.findMany({
      skip: offset,
      take: limit,
      include: {
        machine: true, // include related machine info (optional)
      },
      orderBy: {
        id: 'asc', // optional: to keep results consistent
      },
    });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

