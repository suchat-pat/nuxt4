const express = require('express')
const router = express.Router()
const db = require('../../db')
const fs = require('fs')
const path = require('path')
const uploadDir = path.join(__dirname,'../../uploads/signature')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// API สำหรับ Get ข้อมูล
router.get('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const  id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(
            `select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.id_eva=? and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_member,id_eva]
        )
        res.json(rows[0])
    }catch(err){
        console.error('Error Get User',err)
        res.status(500).json({message:'Error Get User'})
    }
})


// API สำหรับ upload ข้อมูล
router.post('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const  id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const file = req.files?.file
        const filename = Date.now() + path.extname(file.name).toLowerCase()
        await file.mv(path.join(uploadDir,filename))
        await db.query(`update tb_commit set signature=? where id_eva=? and id_member=?`,[filename,id_eva,id_member])
        res.status(201).json({message:'Upload Suucess'})
    }catch(err){
        console.error("Error Upload",err)
        res.status(500).json({message:"Error Upload"})
    }
})

// API สำหรับ delete ข้อมูล
router.delete('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const  id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [[doc]] = await db.query(`select signature from tb_commit where id_eva=? and id_member=?`,[id_eva,id_member])
        const fp = path.join(uploadDir,doc.signature)
        if(fs.existsSync(fp)){
            fs.unlinkSync(fp)
        }
        await db.query(`update tb_commit set signature=? where id_eva=? and id_member=?`,[null,id_eva,id_member])
        res.json({message:'Delete Success'})
    }catch(err){
        console.error("Error Delete",err)
        res.status(500).json({message:"Error Delete"})
    }
})

module.exports = router