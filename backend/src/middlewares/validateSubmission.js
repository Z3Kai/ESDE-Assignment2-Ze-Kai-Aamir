// This function validates input and prevents from xss attacks when
// a user tries to make a new submission

const validator = require('validator');
const logger = require('../middlewares/logger');

const validationNewFn = {

    validateNewSubmission: function (req, res, next) {

        logger.info("validateUpdateSubmission middleware called");
        const designTitleInput = req.body.designTitle;
        const designDescriptionInput = req.body.designDescription;

        reDesignTitleInput = new RegExp(`^[\\w\\s]+$`);
        reDesignDescriptionInput = new RegExp(`^[\\w\\s\\.]+$`);

        if (reDesignTitleInput.test(designTitleInput) && reDesignDescriptionInput.test(designDescriptionInput)) {
            next();
        } else {
            logger.info("Error while submitting, most likely validation error");
            res.status(500);
            res.send(`{"message":"Error!!"}`);
        }
    },


} //end validationNewFn


module.exports = validationNewFn;

