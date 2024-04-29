const mongoose = require('mongoose')
const { title } = require('process')

const listSchema = new mongoose.Schema({
    title:'string',
    content:'string',
})
const userSchema = new mongoose.Schema({
    email:'string',
    password:'string',
    lists:[listSchema]
})

module.exports = mongoose.model('User',userSchema)