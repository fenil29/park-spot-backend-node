const secret= require("./secret.js");


const environment = process.env.NODE_ENV?"production":'development'
let jwtKey,databaseUrl,port

if(environment==="production"){
    port=process.env.PORT
    jwtKey=process.env.JWTKEY
    databaseUrl=process.env.DATABASE_URL
    
}else if(environment==="development"){
    port=4001
    jwtKey=secret.jwtKey
    databaseUrl=secret.databaseUrl
}


module.exports = {
    jwtKey,
    databaseUrl,port
  };
  