const mongoose = require('mongoose')

const subcategorySchema = new mongoose.Schema({
    subcategoryName: {
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

module.exports = mongoose.model('subcategory', subcategorySchema)