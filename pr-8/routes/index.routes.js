const express = require('express')
const { deshborad, viewAllProducts, viewWeb, viewWebCategory } = require('../controller/index.controller')
const { isLoggedIn } = require('../middalwear/authMiddleware')
const { consumeToken } = require('../utils/webTokenStore')
const routes = express.Router()


routes.get('/dashboard', deshborad)
routes.get('/view-all-products', viewAllProducts)

// Protected web page - accepts a one-time token to auto-set session
routes.get('/web', (req, res, next) => {
    const { token } = req.query
    if (token) {
        const adminId = consumeToken(token)
        if (adminId) {
            req.session.adminId = adminId
            return next()
        }
        return res.redirect('/admin/login')
    }
    return isLoggedIn(req, res, next)
}, viewWeb)

// Dedicated view page for a single category (child categories)
routes.get('/web/category/:id', isLoggedIn, viewWebCategory)

// ==================== CART ROUTES ====================
// Cart page route - renders cart.ejs
routes.get('/cart', isLoggedIn, (req, res) => {
    res.render('cart')
})

// API endpoint to get cart data as JSON
routes.get('/api/cart', (req, res) => {
    res.json({ cart: req.session.cart || [] })
})

// Add to cart API
routes.post('/api/cart/add', (req, res) => {
    try {
        const { productName, categoryId, categoryName, subcategoryId, subcategoryName, extracategoryId, extracategoryName, price, qty } = req.body
        if (!req.session.cart) req.session.cart = []
        const item = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            productName,
            categoryId,
            categoryName,
            subcategoryId,
            subcategoryName,
            extracategoryId,
            extracategoryName,
            price: Number(price) || 0,
            qty: Number(qty) || 1
        }
        req.session.cart.push(item)
        res.json({ success: true, cart: req.session.cart })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false })
    }
})

// Remove from cart API
routes.post('/api/cart/remove', (req, res) => {
    try {
        const { id } = req.body
        if (!req.session.cart) return res.json({ cart: [] })
        req.session.cart = req.session.cart.filter(i => String(i.id) !== String(id))
        res.json({ cart: req.session.cart })
    } catch (error) {
        res.status(500).json({})
    }
})

routes.get('/', (req, res) => {
    res.redirect('/admin/login')
})

routes.use('/blog',require('./blog.routes'))

module.exports = routes