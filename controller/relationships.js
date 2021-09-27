const relationMann = require('./../db/relationship_manager')
const userMann = require('./../db/user_manager')

async function friendRequest(req, res){
    let sender = req.session.username;
    let reciever = req.body.reciever;

    // If any of these values are not valid, the request can't be done
    if(sender==undefined || reciever==undefined){
        res.sendStatus(400)
        return;
    }

    // If the user he sent us doesn't exist, we don't create a request
    // and inform him of it
    if(await userMann.checkUser(reciever)==0){
        res.sendStatus(404);
        return;
    }

    if(await relationMann.newFriendRequest(sender,reciever))
        res.sendStatus(200);
    else
        res,sendStatus(500);

}


module.exports = {friendRequest};