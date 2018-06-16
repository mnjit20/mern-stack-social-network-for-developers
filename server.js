const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// DB config
const db = require('./config/keys').mongoURI;

//connect to mongo db server

mongoose
  .connect(db)
  .then(() => console.log('mongo db is conencted'))
  .catch(err => console.log(err));


app.get('/', (req, res) => res.send('Hello world with Express JS '));

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);



const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));