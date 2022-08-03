module.exports = (req,res,next)=>{
    if(req.isAuthenticated()) next();
    else res.send("Need to log in first")
}