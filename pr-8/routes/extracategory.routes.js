const express = require('express');
const routes = express.Router();
const upload = require('../middalwear/imageUpload');

const {
    addextracategoryPage,
    addextracategory,
    viewextracategory,
    deleteextracategory,
    getSubcategories,
    editextracategoryPage,
    updateextracategory   // ✅ Added
} = require('../controller/extracategory.controller');


routes.get('/view-extracategory', viewextracategory);

routes.get('/add-extracategory', addextracategoryPage);
routes.post('/add-extracategory', upload.single('profileImg'), addextracategory);

routes.get('/edit-extracategory/:id', editextracategoryPage);

routes.post('/update-extracategory/:id', upload.single('profileImg'), updateextracategory);

routes.get('/delete-extracategory/:id', deleteextracategory);

routes.get('/get-subcategories/:id', getSubcategories);

module.exports = routes;