const checkSession = (req, res, next) => {
    if (!req.session.user && req.path !== '/login') {
        // Redirect to login if there is no active session
        res.redirect('/login');
    } else {
        next(); // Continue to the next middleware or route handler
    }
};

export default checkSession;