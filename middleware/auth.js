module.exports = {
    ensureAuth: (req, res, next) =>{
        if (req.isAuthenticated()) {
            return next()
        }
        else{
            req.flash('error_msg', 'you need to login to view this page')
            res.redirect('/users/login')
        }
    },

    ensureGuest: (req, res, next) =>{
        if (req.isAuthenticated()) {
            res.redirect('/dashboard')
        }else{
            return next()
        }
    }
}