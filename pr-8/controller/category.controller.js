const categoryModel = require('../model/category.model')
const fs = require('fs')
const path = require('path')

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

/* ================= EDIT PAGE ================= */
const editCategoryPage = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id)
        res.render('category/edit-category', { category })
    } catch (error) {
        console.log(error)
        req.flash('error', 'Category not found')
        res.redirect('/category/view-category')
    }
}

/* ================= UPDATE CATEGORY ================= */
const updateCategory = async (req, res) => {
    try {
        const { categoryName } = req.body

        const updateData = {
            categoryName
        }

        if (req.file) {
            updateData.profileImg = req.file.filename
        }

        await categoryModel.findByIdAndUpdate(req.params.id, updateData)

        req.flash('success', 'Category updated successfully')
        res.redirect('/category/view-category')

    } catch (error) {
        console.log(error)
        req.flash('error', 'Failed to update category')
        res.redirect('/category/view-category')
    }
}

/* ================= DELETE CATEGORY ================= */
const deleteCategory = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id)

        if (!category) {
            req.flash('error', 'Category not found')
            return res.redirect('/category/view-category')
        }

        // Delete image from uploads folder
        if (category.profileImg) {
            const imagePath = path.join(__dirname, '../uploads/', category.profileImg)
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath)
            }
        }

        await categoryModel.findByIdAndDelete(req.params.id)

        req.flash('success', 'Category deleted successfully')
        res.redirect('/category/view-category')

    } catch (error) {
        console.log(error)
        req.flash('error', 'Failed to delete category')
        res.redirect('/category/view-category')
    }
}

module.exports = {
    addcategoryPage,
    addcategory,
    viewCategory,
    editCategoryPage,
    updateCategory,
    deleteCategory
}