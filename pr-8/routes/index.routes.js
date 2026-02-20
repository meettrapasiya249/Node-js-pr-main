const express = require('express')
const { deshborad, viewAllProducts, viewWeb } = require('../controller/index.controller')
const { isLoggedIn } = require('../middalwear/authMiddleware')
const routes = express.Router()


routes.get('/dashboard', deshborad)
routes.get('/view-all-products', viewAllProducts)
// Protected web page - requires admin login
routes.get('/web', isLoggedIn, viewWeb)
routes.get('/', (req, res) => {
    res.redirect('/admin/login')
})

routes.use('/blog',require('./blog.routes'))

module.exports = routes