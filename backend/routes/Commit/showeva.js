const express = require('express')
const router = express.Router()
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

router.get('/user',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const  id_member = req.user.id_member
        const [rows] = await db.query(
            `select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_member]
        )
        res.json(rows)
    }catch(err){
        console.error('Error Get User',err)
        res.status(500).json({message:'Error Get User'})
    }
})

module.exports = router