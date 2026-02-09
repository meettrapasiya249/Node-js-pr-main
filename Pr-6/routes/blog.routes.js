const express = require('express')
const { addblogpage, addblog, viewblogpage, singleviewblogpage, deleteblog, editblog, updateblog } = require('../controller/blog.controller')
const upload = require('../middalwear/imageUpload')
const routes = express.Router()

routes.get('/add-blog',addblogpage)
routes.post('/add-blog',upload.single('authorImage'),addblog)
routes.get('/view-blog',viewblogpage)
routes.get('/view-blog/:id',singleviewblogpage)
routes.get('/delete-blog/:id',deleteblog)
routes.get('/edit-blog/:id',editblog)
routes.post('/update-blog/:id',upload.single('authorImage'),updateblog)

module.exports = routes