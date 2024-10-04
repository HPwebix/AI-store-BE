const jwt = require("jsonwebtoken");
const Publisher = require("../models/Publisher");

const AuthenticatePublisher = async (req, res, next) =>{
    try{

        // const token = req.cookies.jwtoken; 
        // const authorizationHeader = req.headers["Authorization"];
        const authorizationHeader = req.headers.authorization;
        // console.log("auth token=>",authorizationHeader.split(" ")[1])
        if(authorizationHeader?.split(" ")[1] !== "null"){

            const token = authorizationHeader.split(" ")[1];
            // console.log("token=>",token)
    
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
            // console.log(verifyToken);
            
            // const rootPublisher = await Publisher.findOne({_id: verifyToken._id , "tokens.token": token});
            const rootPublisher = await Publisher.findOne({_id: verifyToken._id , "tokens.token": token},{OTP:0,tokens:0,createdOn:0,password:0});
    
            const user = await Publisher.findOne({_id:verifyToken._id});
    
            if(!rootPublisher){ throw new Error(" Publisher not Found ") } 
            // if(!rootPublisher){ res.status(401).json({ error : "Unauthorized no token provide", }) } 

            // console.log(rootPublisher)
            req.token = token;
            req.rootPublisher = rootPublisher;
            req.userID = rootPublisher._id;
            req.user = user; 
            // console.log("inside the middleware!") 
            next();
        }else{
            res.status(401).json({ error : "Unauthorized no token provide", }); 
        }


    } catch (err) {
        res.status(401).json({ error : "Unauthorized no token provide", });
    }
}

module.exports = AuthenticatePublisher;