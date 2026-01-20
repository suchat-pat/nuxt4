const express = require('express')
const router = express.Router()
const db = require('../../db')
const bc = require('bcryptjs')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

router.get('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const  id_member = req.user.id_member
        const [rows] = await db.query(`select first_name,last_name,email,username,role from tb_member where id_member=?`,[id_member])
        res.json(rows[0])
    }catch(err){
        console.error('Error Get User',err)
        res.status(500).json({message:'Error Get User'})
    }
})

router.put('/',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const  id_member = req.user.id_member
        const  {first_name,last_name,email,username,password} = req.body
        if(password && password.trim()){
            const pass = await bc.hash(password,10)
            await db.query(`update tb_member set first_name=?,last_name=?,email=?,username=?,password=? where id_member=?`,[first_name,last_name,email,username,pass,id_member])
        }else{
            await db.query(`update tb_member set first_name=?,last_name=?,email=?,username=? where id_member=?`,[first_name,last_name,email,username,id_member])
        }
        const [rows] = await db.query(`select first_name,last_name,email,username,role from tb_member where id_member=?`,[id_member])
        res.json({message:'Update Success!'})
    }catch(err){
        console.error('Error PUT User',err)
        res.status(500).json({message:'Error PUT User'})
    }
})

module.exports = router