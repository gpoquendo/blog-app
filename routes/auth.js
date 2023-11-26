const express = require('express');
const passport = require('passport');
const router = express.Router();
const fs = require('fs');
const uuid = require('uuid');

const userData = require('../data/users.json');

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

    const user = userData.find(user => user.username === username);
    if (user) {
        console.log('User already exists');
        return res.redirect('/auth/register');
    }

    const newUser = {
        id: uuid.v4(),
        username: username,
        password: password // in a real application, make sure to hash the password
    };

    userData.push(newUser);

    fs.writeFileSync('./data/users.json', JSON.stringify(userData), 'utf8');

    res.redirect('/auth/login');
});

/*
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
});
*/

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});

module.exports = router;