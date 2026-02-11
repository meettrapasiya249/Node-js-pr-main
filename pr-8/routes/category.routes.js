const express = require('express')
const routes = express.Router()

const upload = require('../middalwear/imageUpload')
const {
    addcategoryPage,
    addcategory,
    viewCategory
} = require('../controller/category.controller')

routes.get('/add-category', addcategoryPage)
routes.post('/add-category', upload.single('profileImg'), addcategory)

routes.get('/view-category', viewCategory)

module.exports = routes