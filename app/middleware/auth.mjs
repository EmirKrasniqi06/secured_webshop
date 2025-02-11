const auth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  console.log("User not authenticated");
  res.redirect("/login");
};

export default auth;
