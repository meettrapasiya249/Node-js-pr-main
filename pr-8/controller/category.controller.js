const categoryModel = require('../model/category.model')

/* ================= ADD CATEGORY PAGE ================= */
const addcategoryPage = (req, res) => {
    res.render('category/add-category')
}

/* ================= ADD CATEGORY ================= */
const addcategory = async (req, res) => {
    try {
        const { categoryName } = req.body
        const profileImg = req.file ? req.file.filename : ''

        await categoryModel.create({
            categoryName,
            profileImg,
            date: new Date().toLocaleDateString()
        })

        req.flash('success', 'Category added successfully')
        res.redirect('/category/view-category')

    } catch (error) {
        console.log(error)
        req.flash('error', 'Failed to add category')
        res.redirect('/category/add-category')
    }
}

/* ================= VIEW CATEGORY ================= */
const viewCategory = async (req, res) => {
    try {
        const categories = await categoryModel.find()
        res.render('category/view-category', { categories })
    } catch (error) {
        console.log(error)
        res.render('category/view-category', { categories: [] })
    }
}

module.exports = {
    addcategoryPage,
    addcategory,
    viewCategory
}