const config = require('../config/config');
const jwt = require('jsonwebtoken');
const logger = require('../middlewares/logger');
module.exports.checkForValidUserRoleUser = (req, res, next) => {
    //If the token is valid, the logic extracts the user id and the role information.
    //If the role is not user, then response 403 UnAuthorized
    //The user id information is inserted into the request.body.userId
        logger.info('\n\nhttp header - user ', req.headers['user']);
        if (typeof req.headers.authorization !== "undefined") {
            // Retrieve the authorization header and parse out the
            // JWT using the split function
            let token = req.headers.authorization.split(' ')[1];
            //logger.info('\n\nCheck for received token from frontend : \n');
            //logger.info(token);
            jwt.verify(token, config.JWTKey, (err, data) => {
                logger.info('\n\ndata extracted from token \n',data);
                if (err) {
                    logger.info(err);
                    return res.status(403).send({ message: 'Unauthorized access' });
                }
                else {
                    req.body.userId = data.id;
                    next();
                }
            })
  
      }else{
        res.status(403).send({ message: 'Unauthorized access' });

      }
    } //End of checkForValidUserRoleUser