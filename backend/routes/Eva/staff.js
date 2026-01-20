const express = require('express')
const router = express.Router()
const db = require('../../db')
const bc = require('bcryptjs')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')
const path = require('path')
const uploadDir = path.join(__dirname,'../../uploads/evadetail')

router.get('/user',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const  id_member = req.user.id_member
        const [rows] = await db.query(
            `select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_member]
        )
        res.json(rows[0])
    }catch(err){
        console.error('Error Get User',err)
        res.status(500).json({message:'Error Get User'})
    }
})

router.get('/indicate',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const  id_member = req.user.id_member
        const [topics] = await db.query(`select * from tb_topic`)
        const [indicates] = await db.query(`select * from tb_indicate`)
        const result = topics.map(t =>({
            ...t,
            indicates:indicates.filter((i) => i.id_topic === t.id_topic)
        }))
        res.json(result)
    }catch(err){
        console.error('Error PUT User',err)
        res.status(500).json({message:'Error PUT User'})
    }
})

router.get('/save',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const  id_member = req.user.id_member
        const scores = JSON.parse(req.scores.body)
        const fileMap = {}
        await Promise.all(Object.entrise(req.files).map(async ([key,file]) =>{
            const filename = Date.now()+Math.random().toString(36).slice(2)+path.extname(file.name)
            await file.mv(path.join(uploadDir,filename))
            fileMap[key] = filename
        }))
        const [[evaRow]] = await db.query(
            `select * from tb_member m,tb_eva e,tb_system s where e.id_member=? and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_member]
        )
        const id_eva = evaRow.id_eva
        for(scores of item){
            const filename = fileMap[item.file_key]
            await db.query(
                `insert into tb_evadetail (id_eva,id_indicate,status_eva,score_member,detail_eva,file_eva) values(?,?,?,?,?,?)`,
                [id_eva,item.id_indicate,1,item.score]
            )
        }
        res.json(result)
    }catch(err){
        console.error('Error PUT User',err)
        res.status(500).json({message:'Error PUT User'})
    }
})

module.exports = router