const express = require('express');
const bodyParser = require('body-parser'); // latest version of exressJS now comes with Body-Parser!
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

require('dotenv').config()

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

const db = knex({
  // connect to your own database here:
  client: 'pg',
  connection: {
    // host : process.env.POSTGRES_HOST,
    // user : process.env.POSTGRES_USER,
    // password : process.env.POSTGRES_PASSWORD,
    // database : process.env.POSTGRES_DB,
    connectionString: process.env.POSTGRES_URI
  }
});

const app = express();

app.use(morgan('combined'))
app.use(cors())
app.use(express.json()); // latest version of exressJS now comes with Body-Parser!

app.get('/', (req, res)=> { res.send('Smart brains api') })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db)})
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res)})
app.post('/signout', signin.handleSignout)

app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})