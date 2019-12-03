module.exports = function(req, res, next) {
  if (!config.get("requiresAuth")) return next();

  //401 unauthorized, 403 forbidden
  if (!req.user.isAdmin) return res.status(403).send("Access denied");

  next();
};
