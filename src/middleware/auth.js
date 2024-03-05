const jwt = require("jsonwebtoken");
const prisma = require("../db/prisma");

const userAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: {
                email: decoded.email,
            },
        });
        if (!user) {
            res.status(404).send({ error: "User not found." });
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: "Please authenticate." });
    }
};

module.exports = { userAuth };