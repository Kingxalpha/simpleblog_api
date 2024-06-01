const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const fileUpload = require('express-fileupload');
const path = require('path')


const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload({
    createParentPath: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// DB Config
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/profile', require('./routes/profile'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
