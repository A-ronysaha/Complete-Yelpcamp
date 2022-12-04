let Joi = require('joi')

module.exports.formValidateSchema = Joi.object({
    camp: Joi.object({
        title: Joi.string().min(3).max(30).required(),
        location: Joi.string().required(),
        //image: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deteteImages: Joi.array()
})

module.exports.reviewValidateSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})