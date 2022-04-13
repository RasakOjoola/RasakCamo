const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const confirmEmail = await User.find({ email })
        if (confirmEmail.length) {
            req.flash('error', 'The email that you ve entered alread exists. Forgotten password?')

            return res.redirect('/register')
        }
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) {
                next(err)
            } else {
                req.flash('success', ' Welcome to Rasak-Camp')
                res.redirect('/campgrounds')
            }

        })
    }


    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}
module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}
module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout()
    req.flash('success', 'Goodbye')
    res.redirect('/campgrounds')
}