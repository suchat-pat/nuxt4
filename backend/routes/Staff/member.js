const express = require('express')
const router = express.Router()
const db = require('../../db')
const bc = require('bcryptjs')

// API สำหรับ Get ข้อมูล
router.get('/eva',async (req,res) => {
    try{
        const [rows] = await db.query(`select id_member,first_name,last_name,email,username,role from tb_member where role='ผู้รับการประเมินผล' order by id_member desc`)
        res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:"Error Get"})
    }
})

// API สำหรับ Get ข้อมูล
router.get('/commit',async (req,res) => {
    try{
        const [rows] = await db.query(`select id_member,first_name,last_name,email,username,role from tb_member where role='กรรมการประเมิน' order by id_member desc`)
        res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:"Error Get"})
    }
})

// API สำหรับ Update ข้อมูล
router.get('/:id_member',async (req,res) => {
    try{
        const {id_member} = req.params
        const {first_name,last_name,email,username,password,role} = req.body
        const [rows] = await db.query(``)
        res.json(rows)
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:"Error Get"})
    }
})

module.express = router()