const Joi = require("joi");

exports.createTaskSchema = Joi.object({
  title: Joi.string().min(3).required(),

  description: Joi.string().optional(),

  priority: Joi.string().valid("low", "medium", "high", "urgent"),
});
