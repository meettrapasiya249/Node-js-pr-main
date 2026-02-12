const express = require('express')
const { deshborad } = require('../controller/index.controller')
const routes = express.Router()


routes.get('/dashboard', deshborad)
routes.get('/', (req, res) => {
    res.redirect('/admin/login')
})

routes.use('/blog',require('./blog.routes'))

module.exports = routes