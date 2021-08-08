// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const checkUserFn = require('./middlewares/checkUserFn');
const checkUserFnSolution = require('./middlewares/checkUserFnSolution');
const validateFn = require('./middlewares/validateFn');
const verifyFn = require('./middlewares/verifyFn');
const validateSubmission = require('./middlewares/validateSubmission'); 
const validationInvite = require('./middlewares/validationInvite');

// Match URL's with controllers
exports.appRoute = router => {

    router.post('/api/user/login', authController.processLogin);
    router.post('/api/user/register', authController.processRegister);
    router.post('/api/user/process-submission', verifyFn.verifyTokenUserID,validateSubmission.validateNewSubmission, checkUserFn.getClientUserId, userController.processDesignSubmission);
    router.put('/api/user/', userController.processUpdateOneUser);
    router.put('/api/user/design/', verifyFn.verifyTokenUserID,validateFn.validateUpdateSubmission,userController.processUpdateOneDesign); // edited

    router.post('/api/user/processInvitation/',verifyFn.verifyTokenUserID,validationInvite.validateNewInvite,checkUserFn.getClientUserId, userController.processSendInvitation);

    router.get('/api/user/process-search-design/:pagenumber/:search?', verifyFn.verifyTokenUserID, checkUserFn.getClientUserId, userController.processGetSubmissionData);
    router.get('/api/user/process-search-user/:pagenumber/:search?',verifyFn.verifyTokenUserID, checkUserFn.getClientUserId, userController.processGetUserData);
    router.get('/api/user/process-search-user-design/:pagenumber/:search?',verifyFn.verifyTokenUserID, userController.processGetSubmissionsbyEmail);
    router.get('/api/user/:recordId',verifyFn.verifyTokenUserID, userController.processGetOneUserData);
    router.get('/api/user/design/:fileId',verifyFn.verifyTokenUserID, userController.processGetOneDesignData);

};

// userController.processGetOneUserData,