//Only allows an user with a session to move on to 'next()'
function sessionAuth(req,res, next){
    if(!req.session || !req.session.username){
        res.redirect('/')
    }else
        next();
}

module.exports = {sessionAuth}