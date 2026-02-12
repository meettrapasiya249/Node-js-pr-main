const express = require('express')
const routes = express.Router()

const upload = require('../middalwear/imageUpload')

const {
    addcategoryPage,
    addcategory,
    viewCategory,
    editCategoryPage,
    updateCategory,
    deleteCategory
} = require('../controller/category.controller')

/* ADD */
routes.get('/add-category', addcategoryPage)
routes.post('/add-category', upload.single('profileImg'), addcategory)

/* VIEW */
routes.get('/view-category', viewCategory)

/* EDIT */
routes.get('/edit-category/:id', editCategoryPage)
routes.post('/update-category/:id', upload.single('profileImg'), updateCategory)

/* DELETE */
routes.get('/delete-category/:id', deleteCategory)

module.exports = routes