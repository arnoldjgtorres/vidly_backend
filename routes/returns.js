const express = require("express");
const router = express.Router();
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");

const Joi = require("joi");

router.post("/", auth, async (req, res) => {
  const { error } = validateReturn(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!req.headers["x-auth-token"])
    return res.status(401).send("User not logged in");

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId
  });

  if (!rental) return res.status(404).send("Rental not found");

  if (rental.dateReturned)
    return res.status(400).send("Rental already processed");

  rental.return();

  await rental.save();

  await Movie.update(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 }
    }
  );

  return res.status(200).send(rental);
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  return Joi.validate(req, schema);
}

module.exports = router;
