const express = require('express');
const router = express.Router();
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const ip = require('ip');

router.get('/', (req, res) => {
    let localAddress = ip.address();
    res.render('login', {localAddress});
    global.location = req.originalUrl;
});

router.post('/', (req, res) => {
    const { username, password  } = req.body;
    let user = JSON.parse(fs.readFileSync('./config/user.json'));
    let errors = [];
    

    if(username === user.username){
        bcrypt.compare(password, user.password).then(isMatch => {
            if(isMatch){
                const payload = { userId: user.userId, username: user.username, iat: Date.now() };
    
                jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 }, (err, token) => {
                        res.status(200)
                            .cookie('jwt', token, { httpOnly: true, maxAge: 3600000 })
                            .redirect('dashboard');
                });
            } else {
                errors.push({ errorMsg: 'Incorrect username and/or password!' });
                res.render('login', {errors});
            }
        });
    } else {
        errors.push({ errorMsg: 'Incorrect username and/or password!' });
        res.render('login', {errors});
    }
    
});

module.exports = router;