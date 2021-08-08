const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const logger = require('../middlewares/logger');



exports.processLogin = (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;
    try {
        auth.authenticate(email, function(error, results) {
            if (error) {
                let message = 'Credentials are not valid.';
                //return res.status(500).json({ message: message });
                //If the following statement replaces the above statement
                //to return a JSON response to the client, the SQLMap or
                //any attacker (who relies on the error) will be very happy
                //because they relies a lot on SQL error for designing how to do 
                //attack and anticipate how much "rewards" after the effort.
                //Rewards such as sabotage (seriously damage the data in database), 
                //data theft (grab and sell). 
                return res.status(500).json({ message: error });

            } else {
                if (results.length == 1) {
                    if ((password == null) || (results[0] == null)) {
                        return res.status(500).json({ message: 'login failed' });
                    }
                    if (bcrypt.compareSync(password, results[0].user_password) == true) {

                        let data = {
                            user_id: results[0].user_id,
                            role_name: results[0].role_name,
                            token: jwt.sign({ id: results[0].user_id, role:results[0].role_name }, config.JWTKey, {
                                expiresIn: 1800 //Expires in 30mins
                            })
                        }; //End of data variable setup

                        return res.status(200).json(data);
                    } else {
                        // return res.status(500).json({ message: 'Login has failed.' });
                        return res.status(500).json({ message: error });
                    } //End of passowrd comparison with the retrieved decoded password.
                } //End of checking if there are returned SQL results

            }

        })

    } catch (error) {
        return res.status(500).json({ message: error });
    } //end of try



};



 exports.processRegister = (req, res, next) => {
    logger.info('\n\nprocessRegister running.');
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = req.body.password;

   var refullName = new RegExp(`^[a-zA-Z0-9\s, ']+$`);
   var rePassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
   var reEmail = new RegExp(`^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$`);
        
     if (refullName.test(fullName)&&(rePassword.test(password))&&(reEmail.test(email))){
        logger.info("Successfully Registered");
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                logger.info("here 3");
                logger.info('\n\nError on hashing password');
                return res.status(500).json({
                    statusMessage: 'Unable to complete registration'
                });
            } else {
                
    
                results = user.createUser(fullName, email, hash, function (results, error) {
                    if (results != null) {
                        logger.info(results);
                        return res.status(200).json({
                            statusMessage: 'Completed registration.'
                        });
                    }
                    if (error) {
                        logger.info('\n\nprocessRegister method : callback error block section is running.');
                        logger.info(error, '==================================================================');
                        return res.status(500).json({
                            statusMessage: 'Unable to complete registration'
                        });
                    }
                }); //End of anonymous callback function
    
    
            }
        });
    } else {
        
        logger.info("here");
        logger.info("Registration Failed");
        res.status(500);
        
        res.send(`{"Message":"Error!!"}`);
    }
    

    


}; // End of processRegister