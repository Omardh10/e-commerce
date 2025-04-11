const jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {

    const authtoken = req.headers.authorization;
    if (authtoken) {
        const token = authtoken.split(" ")[1];        //    Authorization && authorization    //
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(406).json({ message: "invalid token ..." })
        }
    } else {
        return res.status(406).json({ message: "no token provided" })
    }
}

const verifytokenandonlyuser = (req, res, next) => {
    verifytoken(req, res, () => {
        if (req.user.id===req.params.id) {
            next();
        } else {
            return res.status(403).json({ message: "you are not allowd only user himself ... " })
        }
    })
}
const verifytokenandisadmin = (req, res, next) => {
    verifytoken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "you are not allowd only user admin ... " })
        }
    })
}
const verifytokenandauthorization= (req, res, next) => {
    verifytoken(req, res, () => {
        if (req.user.id===req.params.id||req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "you are not allowd only user himself or admin ... " })
        }
    })
}
module.exports={
    verifytoken,
    verifytokenandonlyuser,
    verifytokenandauthorization,
    verifytokenandisadmin
}