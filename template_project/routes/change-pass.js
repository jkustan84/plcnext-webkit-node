const express = require('express');
const router = express.Router();
const passport = require('passport');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const deviceInputData = require('../pxc_modules/plcnextAPI');


router.get('/change-pass', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.render('change-pass', {deviceInputData});
    global.location = req.originalUrl;
});

router.post('/change-pass', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { password, passwordNew, passwordNewConf  } = req.body;
    let errors = [];

    if( !password || !passwordNew || !passwordNewConf ){
        errors.push({ errorMsg: 'Please fill in all required fields!' });
    }

    if(errors.length > 0){
        res.render('change-pass', {
            errors
        });
    } else {
        let user = JSON.parse(fs.readFileSync('./config/user.json'));

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;

            if(isMatch){
                if(passwordNew === passwordNewConf && passwordNew.length >= 6){
                    let updatedUser = {
                        "id": uniqid(),
                        "username": user.username,
                        "password": passwordNew
                    }
        
                    bcrypt.genSalt(10, (err, salt) => {
                        if(err) throw err;
        
                        bcrypt.hash(updatedUser.password, salt, (err, hash) => {
                            if(err) throw err;
        
                            updatedUser.password = hash;
        
                            fs.writeFile('./config/user.json', JSON.stringify(updatedUser), (err) => {
                                if (err){
                                    errors.push({ errorMsg: 'Failed to write configuration to device!' });
                                    res.render('change-pass', {
                                        errors
                                    });
                                } else {
                                    req.flash('success_msg', 'Password updated!');
                                    res.redirect('dashboard');
                                }
                            });
                        });
                    });
                } else if (passwordNew !== passwordNewConf){
                    errors.push({ errorMsg: 'New passwords do not match!' });
                    res.render('change-pass', {
                        errors
                    });
                } else if (passwordNew.length < 6){
                    errors.push({ errorMsg: 'Password must be at least 6 characters!' });
                    res.render('change-pass', {
                        errors
                    });
                }
            } else {
                errors.push({ errorMsg: 'Incorrect password!' });
                res.render('change-pass', {
                    errors
                });
            }
        });
    }
});

module.exports = router;