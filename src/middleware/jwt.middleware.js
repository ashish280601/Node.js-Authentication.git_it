/* 
STEPS TO CREATE A JSON_WEB_TOKEN
1. Import the jsonwebtoken library
2. Create a function with req, res & next
3. Check the token received or not in my authorization(HEADERS)
4. If it is received then verify with scerect_KEY
*/

// 1. Importing an jsonwebtoken library
import jwt from "jsonwebtoken";
import "../../env.js";

// 2. Create a function with req, res & next.
const jwtAuth = async(req, res, next) => {
    // Storing a token.
    const token = req.headers['authorization'];
    // If header is empty return an error.
    if(!token){
        return res.status(401).json({
            message: "Unauthorized user",           
            status: false
        })
    }
    // Validating an token.
    try {
        console.log(process.env.SECRET_KEY);
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.userID = payload.userID;
        console.log("payload", payload);
    } catch (error) {
        console.log("Error", error);
        return res.status(401).json({
            message: "Unauthorized user",
            status: false
        })
    }
    // If user is verify calling next middleware in pipeline.
    next();
}

export default jwtAuth;