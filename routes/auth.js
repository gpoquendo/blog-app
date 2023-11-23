const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log(err);
            return res.redirect('/auth/register');
        }
        if (user) {
            console.log('User already exists');
            return res.redirect('/auth/register');
        }
        const newUser = new User({ username: username });
        User.register(newUser, password, (err) => {
            if (err) {
                console.log(err);
                return res.redirect('/auth/register');
            }
            passport.authenticate('local')(req, res, () => {
                res.redirect('/login');
            });
        });
    });
    
    /*
    // After successful registration, redirect to the login page
    res.redirect('/auth/login');
    */
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      }); // Passport.js function to logout
    //res.redirect('/login'); // Redirect to home page or login page after logout
});

module.exports = router;