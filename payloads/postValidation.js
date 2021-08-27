const Joi = require("joi");
const validateRequest = require("../utils/validation");

module.exports = {
  createPostSchema,
  likePostSchema,
};

function createPostSchema(req, res, next) {
  const schemaRules = {
    text: Joi.string().required(),
    photo: Joi.string().required(),
  };

  validateRequest(req, next, Joi.object(schemaRules));
}

/*
  ------User login server side validation-------
*/

function likePostSchema(req, res, next) {
  const schemaRules = {
    postId: Joi.string().required(),
  };

  validateRequest(req, next, Joi.object(schemaRules));
}
