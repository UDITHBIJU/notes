const express = require('express')
const mongoose = require('mongoose')

const rout = require("./routes/user");


const app = express()
mongoose.connect("mongodb://127.0.0.1:27017/notes");

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/api/users',rout)



app.listen(4001)