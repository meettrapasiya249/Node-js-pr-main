
exports.deshborad = async(req,res)=>{
    try {
        res.render('deshboard')
    } catch (error) {
        console.log(error)
    }
}