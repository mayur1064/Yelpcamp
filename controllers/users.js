const User = require('../models/user')

module.exports.renderRegisterForm = (req, res) => {
    res.render('user/register')
}

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelpcamp');
            res.redirect('/campgrounds')

        })
        //console.log(registeredUser)
    }catch(e) {
        req.flash('error',e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('user/login')
}

module.exports.loginUser = async (req, res) => {
    const returnto = req.session.returnto  || '/campgrounds';
    delete req.session.returnto;
    req.flash('success','Welcome Back !')
    res.redirect(returnto)
    
}

module.exports.logoutUser = (req,res) => {
    req.logout();
    req.flash('success','Logged Out Successfully')
    res.redirect('/campgrounds')
}

