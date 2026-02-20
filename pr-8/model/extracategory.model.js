const mongoose = require('mongoose');

const extracategorySchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // match model name in category.model.js
        required: true
    },
    subcategoryId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory', // match model name in subcategory.model.js
        required: true
    },
    extracategoryName: {
        type: String,
        required: true
    },
    profileImg: {
        type: String
    }
});

// Export correctly
module.exports = mongoose.model('extracategory', extracategorySchema);