var uid = require('uid');

/**
 * Game Starter route '/'
 */
exports.index = function(req, res) {

	var userId = '';

	if(req.session && req.session.user && req.session.user._id) {
		userId = req.session.user._id;
	}

    res.render('layout', {
		userId: userId,
        env: process.env.NODE_ENV || 'development',
    });
}
