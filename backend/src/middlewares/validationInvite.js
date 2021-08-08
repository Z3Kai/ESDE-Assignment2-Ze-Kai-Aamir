// This function validates input and prevents from xss attacks when
// a user tries to make a new submission

const validator = require('validator');
const logger = require('../middlewares/logger');

const validationInvite = {

    validateNewInvite: function (req, res, next) {

        logger.info("validateUpdateSubmission middleware called");
        const recipientName = req.body.recipientName;
        const recipientEmail = req.body.recipientEmail;

        var rerecipientName = new RegExp(`^[a-zA-Z0-9\s, ']+$`);
        var rerecipientEmail = new RegExp(`^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$`);

        if (rerecipientName.test(recipientName) && rerecipientEmail.test(recipientEmail)) {
            next();
        } else {
            logger.info("Error while submitting, most likely validation error");
            res.status(500);
            res.send(`{"message":"Error!!"}`);
        }
    },


} //end validationNewFn


module.exports = validationInvite;

