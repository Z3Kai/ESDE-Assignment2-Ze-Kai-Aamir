//Reference: https://cloudinary.com/documentation/node_integration
const cloudinary = require('cloudinary').v2;
const config = require('../config/config');
const pool = require('../config/database')
const logger = require('../middlewares/logger');
cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    upload_preset: 'upload_to_design'
});

module.exports.uploadFile = (file, callback) => {
        logger.info(file);

        // upload image here
        cloudinary.uploader.upload(file.path, { upload_preset: 'upload_to_design' })
            .then((result) => {
                //Inspect whether I can obtain the file storage id and the url from cloudinary
                //after a successful upload.
                //logger.info({imageURL: result.url, publicId: result.public_id});
                let data = { imageURL: result.url, publicId: result.public_id, status: 'success' };
                callback(null, data);
                return;

            }).catch((error) => {

                let message = 'fail';
                callback(error, null);
                return;

            });

    } //End of uploadFile
module.exports.createFileData = (imageURL, publicId, userId, designTitle, designDescription) => {
        logger.info('\n\ncreateFileData method is called.');
        return new Promise((resolve, reject) => {
            //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
            //to prepare the following code pattern which does not use callback technique (uses Promise technique)
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.info('\n\nDatabase connection error ', err);
                    resolve(err);
                } else {
                    logger.info('\n\nExecuting query');
                    let query = `INSERT INTO file ( cloudinary_file_id, cloudinary_url , 
                 design_title, design_description,created_by_id ) 
                 VALUES (?,?,?,?,?) `;

                    connection.query(query, [publicId,imageURL,designTitle,designDescription,userId], (err, rows) => {
                        if (err) {
                            logger.info('\n\nError on query on creating record inside file table', err);
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                        connection.release();
                    });
                }
            });
        }); //End of new Promise object creation

    } //End of createFileData

module.exports.getFileData = (userId, pageNumber, search) => {
        
        logger.info('\n\ngetFileData method is called.');
        const page = pageNumber;
        if (search == null) { search = ''; };
        const limit = 4; //Due to lack of test files, I have set a 3 instead of larger number such as 10 records per page
        const offset = (page - 1) * limit;
        let designFileDataQuery = '';
        //If the user did not provide any search text, the search variable
        //should be null. The following logger.info should output undefined.
        //logger.info(search);
        //-------------- Code which does not use stored procedure -----------
        //Query for fetching data with page number and offset (and search)
        if ((search == '') || (search == null)) {
            logger.info('\n\nPrepare query without search text');
            designFileDataQuery = `SELECT file_id,cloudinary_url,design_title,design_description  
        FROM file  WHERE created_by_id=${userId}  LIMIT ${limit} OFFSET ${offset};
        SET @total_records =(SELECT count(file_id) FROM file WHERE created_by_id= ${userId}   );SELECT @total_records total_records; `;
        } else {
            //code changed here
            designFileDataQuery = `SELECT file_id,cloudinary_url,design_title,design_description 
            FROM file  WHERE created_by_id=? AND design_title LIKE ?  LIMIT ? OFFSET ?;
            SET @total_records =(SELECT count(file_id) FROM file WHERE created_by_id= ? AND design_title LIKE ? );SELECT @total_records total_records;`;
        }
        //--------------------------------------------------------------------
        //designFileDataQuery = `CALL sp_get_paged_file_records(?,?,?,?, @total_records); SELECT @total_records total_records;`;

        return new Promise((resolve, reject) => {
            //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
            //to prepare the following code pattern which does not use callback technique (uses Promise technique)
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.info('\n\nDatabase connection error ', err);
                    resolve(err);
                } else {
                    logger.info('\n\nExecuting query to obtain 1 page of 3 data');
                    //code changed here
                    search="%"+search+"%";
                    connection.query(designFileDataQuery, [userId, search, limit, offset,userId,search], (err, results) => {
                        if (err) {
                            logger.info('\n\nError on query on reading data from the file table', err);
                            reject(err);
                        } else {
                            //The following code which access the SQL return value took 2 hours of trial
                            //and error.
                            logger.info('\n\nAccessing total number of rows : ', results[2][0].total_records);
                            resolve(results);
                        }
                        connection.release();
                    });
                }
            });
        }); //End of new Promise object creation

    } //End of getFileData
    module.exports.getFileDataByUserId = (userId, pageNumber) => {
        
        logger.info('\n\ngetFileDataByUserId method is called. userId = ' + userId);
        const page = pageNumber;
        
        const limit = 4; //Due to lack of test files, I have set a 3 instead of larger number such as 10 records per page
        const offset = (page - 1) * limit;
        let designFileDataQuery = '';
        
        //Query for fetching data with page number and offset 

            designFileDataQuery = `SELECT file_id,cloudinary_url,design_title,design_description 
            FROM file  WHERE created_by_id=? LIMIT ? OFFSET ?;
            SET @total_records =(SELECT count(file_id) FROM file WHERE created_by_id= ? );SELECT @total_records total_records;`;
        return new Promise((resolve, reject) => {
            //I referred to https://www.codota.com/code/javascript/functions/mysql/Pool/getConnection
            //to prepare the following code pattern which does not use callback technique (uses Promise technique)
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.info('\n\nDatabase connection error ', err);
                    resolve(err);
                } else {
                    logger.info('\n\nExecuting query to obtain 1 page of 3 data');
                    connection.query(designFileDataQuery, [userId, limit, offset,userId], (err, results) => {
                        if (err) {
                            logger.info('\n\nError on query on reading data from the file table', err);
                            reject(err);
                        } else {
                            //The following code which access the SQL return value took 2 hours of trial
                            //and error.
                            logger.info('\n\nAccessing total number of rows : ', results[2][0].total_records);
                            resolve(results);
                        }
                        connection.release();
                    });
                }
            });
        }); //End of new Promise object creation

    } //End of getFileDataByUserId