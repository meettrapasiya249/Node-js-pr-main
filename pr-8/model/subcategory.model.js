const mongoose = require('mongoose')

const subcategorySchema = new mongoose.Schema({
    subcategoryName: {
        type: String,
        required: true,
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',   // ⚠️ Yaha Category capital C hona chahiye
        required: true
    },

    date: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Subcategory', subcategorySchema)