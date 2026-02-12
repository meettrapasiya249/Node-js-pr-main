const express = require('express')
const routes = express.Router()

const upload = require('../middalwear/imageUpload')

const {
    addsubcategoryPage,
    addsubcategory,
    viewsubcategory,
    editsubcategoryPage,
    updatesubcategory,
    deletesubcategory
} = require('../controller/subcategory.controller')

routes.get('/add-subcategory', addsubcategoryPage)
routes.post('/add-subcategory', upload.single('profileImg'), addsubcategory)

routes.get('/view-subcategory', viewsubcategory)

routes.get('/edit-subcategory/:id', editsubcategoryPage)
routes.post('/update-subcategory/:id', upload.single('profileImg'), updatesubcategory)

routes.get('/delete-subcategory/:id', deletesubcategory)

module.exports = routes