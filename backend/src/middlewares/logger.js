const {

    createLogger,

    format,

    transports

} = require("winston")




const logger = createLogger({

    transports: [

        new transports.File({

            filename: "logging.txt",

            level: "info",

            format: format.combine(format.timestamp(), format.simple())

        })
        ,

        new transports.Console({

            // filename:"logging.txt",

            level:"info",

            format: format.simple()

        })

    ]

})



module.exports = logger;