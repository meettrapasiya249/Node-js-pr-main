const categoryModel = require('../model/category.model')
const subcategoryModel = require('../model/subcategory.model')
const extracategoryModel = require('../model/extracategory.model')

exports.deshborad = async(req,res)=>{
    try {
        res.render('deshboard')
    } catch (error) {
        console.log(error)
    }
}

// View all products (categories with subcategories and extracategories)
exports.viewAllProducts = async(req,res)=>{
    try {
        // Fetch all categories
        const categories = await categoryModel.find()

        // For each category, fetch subcategories and extracategories
        const categoriesWithDetails = await Promise.all(
            categories.map(async(category) => {
                const subcategories = await subcategoryModel.find({ categoryId: category._id })
                const extracategories = await extracategoryModel.find({ categoryId: category._id })
                
                return {
                    ...category.toObject(),
                    subcategories,
                    extracategories
                }
            })
        )

        res.render('AllProducts/view-allproducts', { categories: categoriesWithDetails })
    } catch (error) {
        console.log(error)
        res.render('AllProducts/view-allproducts', { categories: [] })
    }
}

// View single product with all details
exports.viewSingleProduct = async(req,res)=>{
    try {
        const { id } = req.params
        
        // Fetch the category/product by ID
        const product = await categoryModel.findById(id)
        
        if (!product) {
            return res.status(404).render('AllProducts/view-allproducts', { 
                categories: [],
                message: 'Product not found'
            })
        }
        
        // Fetch subcategories for this product
        const subcategories = await subcategoryModel.find({ categoryId: id })
        
        // Fetch extracategories for this product and populate their subcategory
        const extracategories = await extracategoryModel.find({ categoryId: id }).populate('subcategoryId', 'subcategoryName')
        
        res.render('AllProducts/view-single-product', { 
            product,
            subcategories,
            extracategories
        })
    } catch (error) {
        console.log(error)
        res.status(500).render('AllProducts/view-single-product', { 
            product: null,
            subcategories: [],
            extracategories: []
        })
    }
}

// Protected web page showing all products with header/footer
exports.viewWeb = async (req, res) => {
    try {
        const allCategories = await categoryModel.find()

        // Build detailed list for all categories (for menu)
        const categoriesMenu = await Promise.all(
            allCategories.map(async (category) => {
                const subcategories = await subcategoryModel.find({ categoryId: category._id })
                const extracategories = await extracategoryModel.find({ categoryId: category._id })
                return {
                    ...category.toObject(),
                    subcategories,
                    extracategories
                }
            })
        )

        const { category: categoryId } = req.query

        if (categoryId) {
            // find specific category
            const category = await categoryModel.findById(categoryId)
            if (!category) return res.render('web', { categories: categoriesMenu, selected: null })

            const subcategories = await subcategoryModel.find({ categoryId: category._id })
            const extracategories = await extracategoryModel.find({ categoryId: category._id })

            const selected = {
                ...category.toObject(),
                subcategories,
                extracategories
            }

            return res.render('web', { categories: categoriesMenu, selected })
        }

        // default: show all categories
        res.render('web', { categories: categoriesMenu, selected: null })
    } catch (error) {
        console.log(error)
        res.render('web', { categories: [], selected: null })
    }
}

// View a single category on a dedicated public page (shows child categories)
exports.viewWebCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await categoryModel.findById(id)
        if (!category) return res.status(404).render('web-single-category', { category: null, subcategories: [], extracategories: [] })

        const subcategories = await subcategoryModel.find({ categoryId: category._id })
        const extracategories = await extracategoryModel.find({ categoryId: category._id }).populate('subcategoryId', 'subcategoryName')

        res.render('web-single-category', {
            category,
            subcategories,
            extracategories
        })
    } catch (error) {
        console.log(error)
        res.status(500).render('web-single-category', { category: null, subcategories: [], extracategories: [] })
    }
}

// Delete product
exports.deleteProduct = async(req,res)=>{
    try {
        const { id } = req.params
        
        // Delete the category
        await categoryModel.findByIdAndDelete(id)
        
        // Delete all subcategories for this product
        await subcategoryModel.deleteMany({ categoryId: id })
        
        // Delete all extracategories for this product
        await extracategoryModel.deleteMany({ categoryId: id })
        
        req.flash('success', 'Product deleted successfully')
        res.redirect('/product/view-allproduct')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Failed to delete product')
        res.redirect('/product/view-allproduct')
    }
}