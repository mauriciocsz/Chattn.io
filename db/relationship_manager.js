const query = require('./db_conn')

async function getRelations(user){
    let relations = await query('SELECT * FROM relationship WHERE user1=$1 OR user2=$1',[user]);

    return relations.rows;
}

async function newRelation(user1,user2){
    let order = [user1,user2].sort()
    await query('INSERT INTO relationship values($1,$2)',[order[0],order[1]])

    return 1;
}

module.exports = {getRelations, newRelation}