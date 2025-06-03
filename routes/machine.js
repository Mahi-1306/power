const express=require('express');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');
const prisma = new PrismaClient();
const router = express.Router();


router.use(verifyToken)

router.post('/post', async (req, res) => {
  const { machine_name } = req.body;
  const created_by = req.user.id; // fetched from token

  try {
    const machine = await prisma.machine.create({
      data: {
        machine_name,
        created_by,
      },
    });
    res.json(machine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.get("/", async (req, res) => {
  const userId = req.user.userId;
  try {
    const machines = await prisma.machine.findMany({
      where: {
        created_by: userId, // Filter by the user who created the machine
      },
    });
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id',async(req,res)=>{
    const{id}=req.params;
    const{machine_name,created_by}=req.body;
    try{
        const machine=await prisma.machine.update({
            where:{id},
            data:{machine_name,created_by},
        });
        res.json(machine);
    }
    catch(error)
    {
        res.status(400).json({error:error.message});
    }
});

router.delete('/:id',async(req,res)=>{
    const {id}=req.params;
    try{
        await prisma.machine.delete({where:{id}});
        res.json({message:'Machine deleted'});
    }
    catch(error)
    {
        res.status(400).json({error:error.message});
    }
});

module.exports=router;