const express = require('express');
const router = express.Router();


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', "You are logged out.");
    res.redirect('/');
    global.location = req.originalUrl;
});

module.exports = router;