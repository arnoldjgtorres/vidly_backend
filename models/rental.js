const mongoose = require("mongoose");
const Joi = require("joi");
const moment = require("moment");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }
    }),
    isGold: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    }
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 30
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

rentalSchema.methods.return = function() {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, "days");
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
};

const Rental = new mongoose.model("Rental", rentalSchema);

function validateRental(movie) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  console.log(movie);
  return Joi.validate(movie, schema);
}

module.exports.rentalSchema = rentalSchema;
module.exports.validate = validateRental;
module.exports.Rental = Rental;
