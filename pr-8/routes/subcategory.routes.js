const express = require('express')
const routes = express.Router()

const upload = require('../middalwear/imageUpload')

// Functions ke naam Controller ke sath match karne ke liye update kiye gaye hain
const {
    addSubcategoryPage,
    addSubcategory,
    viewSubcategory,    // 'S' capital
    editSubcategoryPage, // 'S' capital
    updateSubcategory,  // 'S' capital
    deleteSubcategory   // 'S' capital
} = require('../controller/subcategory.controller')

routes.get('/add-subcategory', addSubcategoryPage)
routes.post('/add-subcategory', upload.single('profileImg'), addSubcategory)

routes.get('/view-subcategory', viewSubcategory)

routes.get('/edit-subcategory/:id', editSubcategoryPage)
routes.post('/update-subcategory/:id', upload.single('profileImg'), updateSubcategory)

routes.get('/delete-subcategory/:id', deleteSubcategory)

module.exports = routes