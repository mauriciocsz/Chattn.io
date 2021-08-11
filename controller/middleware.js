//Only allows an user with a session to move on to 'next()'
function sessionAuth(req,res, next){
    if(!req.session || !req.session.username){
        res.status(401).send('Erro!')
    }else
        next();
}

module.exports = {sessionAuth}