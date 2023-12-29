const jwt = require('jsonwebtoken');
const redis = require('redis');

let redisClient = undefined;

const initiateRedisClient = async () => {
  redisClient = await redis.createClient({
    url: process.env.REDIS_URI
  })
  .on('error', () => console.log("Redis client error!"))
  .connect();
}

const getRedisClient = () => {
  return redisClient;
}

initiateRedisClient();

const getUserById = async (id, db) => {
  const users = await db.select('*').from('users').where('id', '=', id);
  if(!users?.length) return undefined;

  return users[0];
}

const authenticateUser = async (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw Error(`${!email ? 'Email' : 'Password'} not provided!`);
  }

  const existingUser = await db.select('email', 'hash').from('login').where('email', '=', email);
  if(!existingUser || !existingUser.length) throw Error(`Could not find user with email - ${email}`);

  const [{ _, hash }] = existingUser;
  const areCredentialsValid = bcrypt.compareSync(password, hash);

  if(!areCredentialsValid) throw Error('Wrong credentials!');

  const users = await db.select('*').from('users').where('email', '=', email);
  return users[0];
}

const createToken = (email) => {
  const payload = {email: email}
  return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '2 days'});
}

const saveToRedis = async (key, value) => {
  await redisClient?.set(key, value);
}

const createUserSession = async (user) => {
  const {email, id} = user;
  const sessionToken = createToken(email);
  await saveToRedis(sessionToken, id);
  return sessionToken;
}

const getAuthTokenId = async (req, db) => {
  const {authorization} = req.headers;
  const userId = await redisClient.get(authorization, db);
  return await getUserById(userId, db);
}

const handleSignin = (db, bcrypt) => {
  return async (req, res) => {
    const { authorization } = req.headers;

    if(authorization) {
      const userData = await getAuthTokenId(req, db);
      if(!userData) return res.status(400).json({
        success: false, 
        message: 'Could not find user with provided credentials!'
      });

      return res.json({
        success: true, 
        message: 'authenticated', 
        userData
      })
    }

    try {
      const user = await authenticateUser(db, bcrypt, req, res);
      const sessionToken = await createUserSession(user);
      res.json({success: true, message: "auth ok", userData: user, token: sessionToken});
    } catch (error) {
      console.log("ERROR OCCURRED WHILE AUTHENTICATING");
      console.error(error);
      res.status(400).json({error: true, message: 'something went wrong!'});
    }
  }
}

const handleSignout = async (req, res) => {
  const {authorization} = req.headers;

  if(!authorization) return res.status(400);

  if(redisClient.exists(authorization)) {
    redisClient.del(authorization);
  }
  return res.json({success: true});
}

module.exports = {
  handleSignin: handleSignin,
  getRedisClient: getRedisClient,
  redisClient: redisClient,
  handleSignout
}
