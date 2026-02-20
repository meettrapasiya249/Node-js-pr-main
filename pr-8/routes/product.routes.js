const express = require('express')
const { viewAllProducts, viewSingleProduct, deleteProduct } = require('../controller/index.controller')
const { editCategoryPage, updateCategory } = require('../controller/category.controller')
const upload = require('../middalwear/imageUpload')
const routes = express.Router()

routes.get('/view-allproduct', viewAllProducts)
routes.get('/view-product/:id', viewSingleProduct)
routes.get('/delete-product/:id', deleteProduct)

routes.get('/edit-product/:id', editCategoryPage)
routes.post('/update-product/:id', upload.single('profileImg'), updateCategory)

module.exports = routes
