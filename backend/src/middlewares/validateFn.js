const validator = require('validator');
const logger = require('../middlewares/logger');

const validationFn = {

    validateUpdateSubmission: function (req, res, next) {

        logger.info("validateUpdateSubmission middleware called");
        const fileId = req.body.fileId;
        const designTitleInput = req.body.designTitle;
        const designDescriptionInput = req.body.designDescription;

        reDesignTitleInput = new RegExp(`^[\\w\\s]+$`);
        reDesignDescriptionInput = new RegExp(`^[\\w\\s\\.]+$`);
        reFileId = new RegExp(`^\\d+$`);

        if (reDesignTitleInput.test(designTitleInput) && reDesignDescriptionInput.test(designDescriptionInput) && reFileId.test(fileId)) {
            next();
        } else {
            logger.info("Error while submitting, most likely validation error");
            res.status(500);
            res.send(`{"message":"Error!!"}`);
        }
    },


} //end validationFn


module.exports = validationFn;

