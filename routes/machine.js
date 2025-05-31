const express=require('express');
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middleware/verifyToken');
const prisma = new PrismaClient();
const router = express.Router();


//router.use(verifyToken)

router.post('/post',async(req,res)=>{
const {machine_name, created_by}=req.body;
try{
    const machine=await prisma.machine.create({
        data:{
            machine_name,
            created_by,
        },
    });
    res.json(machine);
}
catch(error)
{
    res.status(400).json({error:error.message});
}

});

router.get('/get',async (req,res)=>{
    const machines=await prisma.machine.findMany({
        include:{createdBy: true, data: true},
    });
    res.json(machines);
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