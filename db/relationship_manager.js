const query = require('./db_conn')

async function getRelations(user){
    let relations = await query('SELECT * FROM relationship WHERE user1=$1 OR user2=$1',[user]);

    return relations.rows;
}

async function getRequests(user){
    let relations = await query('SELECT * FROM friend_requests WHERE reciever=$1',[user]);

    return relations.rows;
}

async function newRelation(user1,user2){
    let order = [user1,user2].sort()
    await query('INSERT INTO relationship values($1,$2)',[order[0],order[1]])

    return 1;
}

// Creates a new friend request
async function newFriendRequest(sender,reciever){

    // First we see if this request has already been made
    let previousRequest = await query ('select count(*) from friend_requests WHERE sender=$1 AND reciever=$2',[sender,reciever]);
    
    // If this request is already made, just return an OK
    if(previousRequest.rows[0].count==1){
        return true;
    }

    // We will also check if both users are already friends beforehand
    let checkIfExists = await query('select count(*) from relationship WHERE (user1=$1 OR user2=$1) AND (user1=$2 OR user2=$2)',[sender,reciever])
    if(checkIfExists.rows[0].count==1){
        return true;
    }
    // Now we will try to put this friend request in the database
    //return 
    if(await query('INSERT INTO friend_requests values($1,$2)',[sender,reciever])!=-1)
        return true;
    return false;

}

// Accepts the friend request and adds user's relationship
async function acceptFriendRequest(sender,reciever){
    // First we see if this request has already been made
    let confirmRequest = await query ('select count(*) from friend_requests WHERE sender=$1 AND reciever=$2',[sender,reciever]);
    
    if(confirmRequest==0)
        return false;

    // Delete the request and any requests involving both users
    try{
        await query('DELETE from friend_requests WHERE (sender=$1 AND reciever=$2) OR (sender=$2 AND reciever=$1)',[sender,reciever]);
    
        await newRelation(sender,reciever);

        return true
    }catch(e){
        return false;
    }
}

// Denies the friend request, deleting it from the table
async function denyFriendRequest(sender,reciever){
    await query('DELETE from friend_requests WHERE sender=$1 AND reciever=$2',[sender,reciever]);

    return true;
}

module.exports = {getRelations,getRequests, newRelation, newFriendRequest,acceptFriendRequest,denyFriendRequest}