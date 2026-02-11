const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        default: ''
    },
    date: {
        type: String
    }
})

module.exports = mongoose.model('Category', categorySchema)