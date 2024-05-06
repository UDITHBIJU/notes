const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv').config()
const rout = require("./routes/user");
const app = express()
mongoose.connect("mongodb://127.0.0.1:27017/notes");

app.use(
	cors({
		origin: "http://localhost:3000",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		credentials: true, 
	})
);
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/api/users',rout)



app.listen(4001)
require("./ReminderEmail");