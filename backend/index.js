require('dotenv').config()
const express = require('express')
const fileupload = require('express-fileupload')
const cors = require('express-fileupload')
const app = express()
const path = require('path')

app.use(cors ({
    origin:'http://localhost:3000',
    credentials:true
}))

app.use(express.json())
app.use(fileupload())
app.use('/uploads',express.static(path.join('uploads')))

app.use( (req,res) => res.status(404).json({ message:'ระบบปิดปรับปรุง!' }) )
app.listen(3001 , () => console.log('Server Running On Port 3001'))