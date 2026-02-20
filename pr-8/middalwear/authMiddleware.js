const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.adminId) {
        next()
    } else {
        const nextUrl = encodeURIComponent(req.originalUrl || '/')
        res.redirect('/admin/login?next=' + nextUrl)
    }
}

module.exports = { isLoggedIn }
