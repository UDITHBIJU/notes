const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
    list:'string'
})
const userSchema = new mongoose.Schema({
    email:'string',
    password:'string',
    lists:[listSchema]
})

module.exports = mongoose.model('User',userSchema)