const { currntdate } = require('../middalwear/currntDate')
const blogmodle = require('../model/blog.model')
const path = require('path')
const fs = require('fs')

exports.addblogpage = async(req,res)=>{
    try {
        res.render('blog/addblog')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.addblog = async(req,res)=>{
    try {
        let imagepath="";
        if(req.file){
       imagepath = `/uploads/${req.file.filename}`
        }
        
        await blogmodle.create({
            ...req.body,
            authorImage:imagepath,
            date:currntdate()
        })
        res.redirect('/blog/view-blog')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.viewblogpage = async(req,res)=>{
    try {
        let search = req.query.search || ""
        let status = req.query.status || ""
        let page = parseInt(req.query.page) || 1;
        let limit = 3;  
        
        let filter = {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } }
            ]
        };
        
        if(status) {
            filter = {
                $and: [
                    filter,
                    { status: { $regex: status, $options: "i" } }
                ]
            };
        }
        
        let totalBlogs = await blogmodle.countDocuments(filter);
        let totalPages = Math.ceil(totalBlogs / limit);
        let skip = (page - 1) * limit;
      
        let blogs = await blogmodle.find(filter)
            .skip(skip)
            .limit(limit);
            
        res.render('blog/viewblog',{
            blogs,
            currentPage: page,
            totalPages,
            totalBlogs,
            search: search,
            status: status
        });
    } catch (error) {
        console.log(error)
        res.render('blog/viewblog', { 
            blogs: [],
            currentPage: 1,
            totalPages: 1,
            totalBlogs: 0,
            search: ""
        })
    }
}

exports.singleviewblogpage = async(req,res)=>{
    try {
        const id = req.params.id;
        let blog = await blogmodle.findById(id)
        res.render('blog/singleviewblog',{blog})
        
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.deleteblog = async(req,res)=>{
    try {
        const id = req.params.id;
        await blogmodle.findByIdAndDelete(id)
        res.redirect('/blog/view-blog')
        
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.editblog = async(req,res)=>{
    try {
        const id = req.params.id;
        let blog = await blogmodle.findById(id)
        res.render('blog/editblog',{blog})
        
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
}

exports.updateblog = async(req,res)=>{
    try {
        let id = req.params.id
        let blog = await blogmodle.findById(id)
        let imagepath = blog.authorImage 
        
        if(req.file){
            if(imagepath !== ""){
                let imageurl = path.join(__dirname,"..",imagepath)
                await fs.unlinkSync(imageurl)
            }
            imagepath = `/uploads/${req.file.filename}`
        }

        await blogmodle.findByIdAndUpdate(id,{...req.body,authorImage:imagepath},{new:true})
        res.redirect(`/blog/view-blog/${id}`)

    } catch (error) {
        console.log(error)
        res.redirect('/blog/view-blog')
    }
}

