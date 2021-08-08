const logger = require('../middlewares/logger');
module.exports.getClientUserId = (req, res, next) => {
        logger.info('\n\nhttp header - user ', req.headers['user']);
        req.body.userId = req.headers['user'];
        logger.info('\n\nInspect user id which is planted inside the request header : ', req.body.userId);
        if (req.body.userId != null) {
            next()
            return;
        } else {
            res.status(403).json({ message: 'Unauthorized access' });
            return;
        }

    } //End of getClientUserId