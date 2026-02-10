const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')

const app = express()
const port = 1234

/* ================= DB ================= */
require('./config/dbconnection')

/* ================= VIEW ENGINE ================= */
app.set('view engine', 'ejs')

/* ================= MIDDLEWARES ================= */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))

/* ================= SESSION ================= */
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

/* ================= FLASH ================= */
app.use(flash())

// flash global
app.use((req, res, next) => {
    res.locals.messages = req.flash()
    next()
})

/* ================= CURRENT ADMIN GLOBAL ================= */
const adminModel = require('./model/admin.model')

app.use(async (req, res, next) => {
    try {
        if (req.session && req.session.adminId) {
            const admin = await adminModel.findById(req.session.adminId).lean()
            res.locals.currentAdmin = admin || null
        } else {
            res.locals.currentAdmin = null
        }
    } catch (err) {
        console.error('Error loading currentAdmin:', err)
        res.locals.currentAdmin = null
    }
    next()
})

/* ================= LOGGER ================= */
app.use((req, res, next) => {
    const bodyText =
        Object.keys(req.body || {}).length > 0
            ? JSON.stringify(req.body)
            : ''
    console.log(
        `[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}${
            bodyText ? ' - ' + bodyText : ''
        }`
    )
    next()
})

/* ================= TEST LOGIN (AS YOU GAVE) ================= */
app.post('/test-login', async (req, res) => {
    try {
        console.log('📨 Received request body:', req.body)

        const { email, password } = req.body
        console.log('Email:', email, 'Password:', password)

        const admin = await adminModel.findOne({ email })

        if (!admin) {
            console.log('❌ No user found')
            req.flash('error', '❌ Invalid Email')
            return res.json({
                success: false,
                message: 'Invalid Email',
                messages: req.flash()
            })
        }

        console.log('✅ User found:', admin.email)
        console.log(
            'Password comparison:',
            password,
            '===',
            admin.adminPassword
        )

        if (admin.adminPassword !== password) {
            console.log('❌ Password mismatch')
            req.flash('error', '❌ Invalid Password')
            return res.json({
                success: false,
                message: 'Invalid Password',
                messages: req.flash()
            })
        }

        console.log('✅ Password match!')
        req.session.adminId = admin._id
        req.session.adminName = admin.adminName

        console.log('✅ Session set:', req.session)
        req.flash('success', '✅ Login successful!')

        res.json({
            success: true,
            message: 'Login successful',
            messages: req.flash()
        })
    } catch (error) {
        console.error('❌ Error:', error)
        req.flash('error', '❌ Error: ' + error.message)
        res.json({
            success: false,
            message: error.message,
            messages: req.flash()
        })
    }
})

/* ================= ROUTES ================= */
app.use('/', require('./routes/index.routes'))
app.use('/admin', require('./routes/admin.routes'))

/* ================= DEFAULT ================= */
app.get('/', (req, res) => {
    res.redirect('/admin/login')
})

/* ================= SERVER ================= */
app.listen(port, () => {
    console.log(`🚀 Server started at http://localhost:${port}`)
})