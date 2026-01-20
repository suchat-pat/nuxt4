const express = require('express')
const router = express.Router()
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// =============== Demo ===============
// API สำหรับ Get ข้อมูล
// router.get('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
//     try{
//         const [rows] = await db.query(``)
//         res.json(rows)
//     }catch(err){
//         console.error("Error Get",err)
//         res.status(500).json({message:"Error Get"})
//     }
// })
// =============== Demo ===============

// API สำหรับ Get ข้อมูล
router.get('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [rows] = await db.query(`select * from tb_indicate,tb_topic where tb_indicate.id_topic=tb_topic.id_topic order by id_indicate desc`)
        res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:"Error Get"})
    }
})

// API สำหรับ Get ข้อมูล where params
router.get('/:id_indicate',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_indicate} = req.params
        const [rows] = await db.query(`select * from tb_indicate where id_indicate='${id_indicate}' order by id_indicate desc`)
        res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:"Error Get"})
    }
})

// API สำหรับ Insert ข้อมูล
router.post('/',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_topic,name_indicate,detail_indicate,point_indicate,check_indicate} = req.body
        const [rows] = await db.query(`insert into tb_indicate (id_topic,name_indicate,detail_indicate,point_indicate,check_indicate) values (?,?,?,?,?)`,[id_topic,name_indicate,detail_indicate,point_indicate,check_indicate])
        res.json({rows,message:'Insert Success!'})
    }catch(err){
        console.error("Error Insert",err)
        res.status(500).json({message:"Error Insert"})
    }
})

// API สำหรับ Update ข้อมูล
router.put('/:id_indicate',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_indicate} = req.params
        const {id_topic,name_indicate,detail_indicate,point_indicate,check_indicate} = req.body
        const [rows] = await db.query(`update tb_indicate set  id_topic=?,name_indicate=?,detail_indicate=?,point_indicate=?,check_indicate=? where id_indicate='${id_indicate}'`,[id_topic,name_indicate,detail_indicate,point_indicate,check_indicate])
        res.json({rows,message:'Update Success!'})
    }catch(err){
        console.error("Error Update",err)
        res.status(500).json({message:"Error Update"})
    }
})

// API สำหรับ Delete ข้อมูล
router.delete('/:id_indicate',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const {id_indicate} = req.params
        // const {id_topic,name_indicate,detail_indicate,point_indicate,check_indicate} = req.body
        const [rows] = await db.query(`delete from tb_indicate where id_indicate='${id_indicate}'`)
        res.json({rows,message:'Delete Success!'})
    }catch(err){
        console.error("Error Delete",err)
        res.status(500).json({message:"Error Delete"})
    }
})

module.exports = router