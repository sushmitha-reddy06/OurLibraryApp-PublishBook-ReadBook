const express = require('express');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const cors = require('cors');
const auth_publisherService = require('./Publisher/routes/auth_publisher-routes');
const publishRoutes = require('./Publisher/routes/publish-routes');
const readerRoutes = require('./Reader/routes/reader-route')
const commentRoutes = require('./Reader/routes/comment-route')


const app = express();
app.use(cors());

connectDB();

app.use(express.json());
app.use(bodyParser.json());


app.use(auth_publisherService)
app.use(publishRoutes);
app.use(readerRoutes)
app.use(commentRoutes)

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
