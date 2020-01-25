const Joi = require('@hapi/joi');
const create_user_schema = Joi.object({
    jid: Joi.number()
        .min(1)
        .required(),

    jemail: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','in','org'] } })
        .required(),    
    
    jname: Joi.string()
        .regex(/^[a-zA-Z]+$/)
        .min(3)
        .max(30)
        .required()
        ,

    jaccess: Joi.string()
            .regex(/^[Provider/User]$/)
            .required ,   
         

    jmobile: Joi.string().regex(/^\d{3}\d{3}\d{4}$/), 

    
})

const create_pd_schema = Joi.object({
    jid: Joi.number()
        .min(1)
        .required(),
    
    jname: Joi.string()
        .regex(/^[a-zA-Z]+$/)
        .min(3)
        .max(30)
        .required()
        ,

    jadd: Joi.string()
    .regex(/^[A-Za-z0-9'\.\-\s\,]+$/)
    .required(),

    jpin: Joi.string().required().regex(/^(\d{4}|^\d{6})$/),

    jcood: Joi.string() .regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/)
    .required(),
      
    jentry: Joi.number()
    .min(0)
    .max(1)
    .required(),
    
})

const create_ph_schema = Joi.object({
    jid: Joi.number()
        .min(1)
        .required(),
    
    
})

const create_spot_schema = Joi.object({
    // jid: Joi.number()
    //     .min(1)
    //     .required(),

    // jstatus: Joi.string()
    // .regex(/^[0-1]$/).required(),

    jno: Joi.number()
        .min(1)
        .required(),
    })

const login_schema = Joi.object({
        jid: Joi.number()
            .min(1)
            .required(),
    
        jpass: Joi.string()
            //.regex(/^[a-zA-Z0-9]+$/)
            //.min(6)
            .max(30)
            .required()
            ,   
    
        })
            
        

module.exports = {
        create_user_schema,
        create_pd_schema,
        create_spot_schema,
        login_schema
      }    