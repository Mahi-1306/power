const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();

const prisma = new PrismaClient();

router.post("/add", async (req, res) => {
  const { machine_id, Date: dateString } = req.body;

  let parsedDate = null;
  if (dateString) {
    parsedDate = new Date(dateString);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }
  }

  try {
    const data = await prisma.machinedata.create({
      data: {
        machine_id,
        Date: parsedDate,
      },
    });
    res.status(201).json(data);
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

router.get("getbyid/:id", async (req, res) => {
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
      where: { data_id: id },
      data: {
        machine_id,
        Date: parsedDate,
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

module.exports = router;
