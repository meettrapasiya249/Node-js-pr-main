const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    adminName: {
        type: String,
        required: true
    },
    adminPassword: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    profileImg: {
        type: String
    },
    date: {
        type: String
    }
})

module.exports = mongoose.model('Admin', adminSchema)
