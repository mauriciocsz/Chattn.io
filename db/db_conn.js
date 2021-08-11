const dotenv = require ('dotenv');
dotenv.config();

var {Pool} = require('pg');

var pool = new Pool ({
    connectionString: process.env.DATABASE_URL
})

module.exports = async function(query, values){
    try{
        var result = await pool.query({
            text: query,
            values
        });
        return result;
    }catch(error){
        console.log("=================\n Query error: \n"+error)
        return -1;
    };
}