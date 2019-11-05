//POST /api/returns {customerId, movieId}

//return 401 if client not logged in
//return 400 if customer id is not provided
//return 400 if movie id is not provided
//return 404 if no rental found with customer/movie
//return 400 if rental already processed

//return 200 if valid request
//set return date
//calculate rental fee
//add movie back to stock
//return the rental summary
