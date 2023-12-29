const {getRedisClient} = require('./signin');

const requireAuth = async (req, res, next) => {
    const {authorization} = req.headers;

    if(!authorization) {
        return res.status(401).json({success: false, message: 'User not authenticated!'})
    }

    const redisClient = getRedisClient();

    if(!redisClient) {
        return res.status(401).json({success: false, message: 'Something went wrong'})
    } 
    const userId = await redisClient.get(authorization);

    if(!userId) {
        return res.status(401).json({success: false, message: 'User not authenticated!'})
    } else {
        console.log("You shall pass 👍🏼");
        return next();
    }
}

module.exports = {
    requireAuth
}