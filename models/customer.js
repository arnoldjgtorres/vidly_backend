const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  isGold: { type: Boolean, default: false },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  phone: { type: Number, min: 10, max: 50, required: true }
});

const Customer = new mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    isGold: Joi.boolean(),
    phone: Joi.number()
      .min(10)
      .max(50)
      .required()
  };

  console.log(customer);
  return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
