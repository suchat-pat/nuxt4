require('dotenv').config()
const express = require('express')
const fileupload = require('express-fileupload')
const cors = require('cors')
const app = express()
const path = require('path')

app.use(cors ({
    origin:'http://localhost:3000',
    credentials:true
}))

app.use(express.json())
app.use(fileupload())
app.use('/uploads',express.static(path.join('uploads')))

const auth = require('./routes/auth')
app.use('/api/auth',auth)

const profile = require('./routes/profile')
app.use('/api/profile',profile)

const member = require('./routes/Staff/member')
app.use('/api/Staff/member',member)

const topic = require('./routes/Staff/topic')
app.use('/api/Staff/topic',topic)

const indicate = require('./routes/Staff/indicate')
app.use('/api/Staff/indicate',indicate)
app.use('/api/Staff/topic',topic)

const round_eva = require('./routes/Staff/round_eva')
app.use('/api/Staff/round_eva',round_eva)

//eva
const edit_eva = require('./routes/Eva/edit_eva')
app.use('/api/Eva/edit_eva',edit_eva)

const staff = require('./routes/Eva/staff')
app.use('/api/Eva/staff',staff)

const score_member = require('./routes/Eva/score_member')
app.use('/api/Eva/score_member',score_member)

app.use( (req,res) => res.status(404).json({ message:'ระบบปิดปรับปรุง!' }) )
app.listen(3001 , () => console.log('Server Running On Port 3001'))