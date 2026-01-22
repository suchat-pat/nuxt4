const express = require('express')
const router = express.Router()
const db = require('../db')
const {verifyToken,requireRole} = require('../middleware/authMiddleware')

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
router.get('/staff',verifyToken,requireRole('ฝ่ายบุคลากร'),async (req,res) => {
    try{
        const [[evaCount]] = await db.query(`select count(*)as total from tb_eva`)
        const [[one]] = await db.query(`select count(*)as total from tb_eva where status_eva=3`)
        const [[two]] = await db.query(`select count(*)as total from tb_eva where status_eva!=3`)

        const [[eva]] = await db.query(`select count(*)as totalEva from tb_member where role='ผู้รับการประเมินผล'`)
        const [[commit]] = await db.query(`select count(*)as totalCommit from tb_member where role='กรรมการประเมิน'`)
        res.json({
            box : [
                {label: 'แบบประเมินทั้งหมด',value: evaCount.total || 0},
                {label: 'แบบประเมินที่ยังไม่สำเร็จ',value: evaCount.total > 0  ? `${ ((two.total *100)/ evaCount.total).toFixed(2) }%` : '00.00%'},
                {label: 'แบบประเมินที่สำเร็จไม่สำเร็จ',value: evaCount.total > 0  ? `${ ((one.total *100)/ evaCount.total).toFixed(2) }%` : '00.00%'},
            ],
            box2 : [
                {label:'ผู้รับการประเมินทั้งหมด',value: eva.totalEva || 0},
                {label:'กรรมการประเมินทั้งหมด',value: commit.totalCommit || 0},
            ]
        })
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:"Error Get"})
    }
})

// API สำหรับ Get ข้อมูล
router.get('/eva',verifyToken,requireRole('ผู้รับการประเมินผล'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const [[evaCount]] = await db.query(`select count(*)as total from tb_eva,tb_member where tb_member.id_member='${id_member}' and tb_member.id_member=tb_eva.id_member`)
        const [[one]] = await db.query(`select count(*)as total from tb_eva,tb_member where tb_member.id_member='${id_member}' and tb_member.id_member=tb_eva.id_member and status_eva=1`)
        const [[two]] = await db.query(`select count(*)as total from tb_eva,tb_member where tb_member.id_member='${id_member}' and tb_member.id_member=tb_eva.id_member and status_eva!=1`)

        res.json({
            box : [
                {label: 'แบบประเมินทั้งหมด',value: evaCount.total || 0},
                {label: 'แบบประเมินที่ยังไม่ได้ประเมิน',value: evaCount.total > 0  ? `${ ((two.total *100)/ evaCount.total).toFixed(2) }%` : '00.00%'},
                {label: 'แบบประเมินที่ปประเมินแล้ว',value: evaCount.total > 0  ? `${ ((one.total *100)/ evaCount.total).toFixed(2) }%` : '00.00%'},
            ],
        })
    }catch(err){
        console.error("Error Get",err)
        res.status(500).json({message:"Error Get"})
    }
})

module.exports = router