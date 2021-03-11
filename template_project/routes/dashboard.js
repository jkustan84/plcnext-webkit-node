const express = require('express');
const router = express.Router();
const passport = require('passport');
const deviceInputData = require('../pxc_modules/plcnextAPI');


router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.render('dashboard', {deviceInputData});
    global.location = req.originalUrl;
});

module.exports = router;