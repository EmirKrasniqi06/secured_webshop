const redirectIfAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.redirect("/profile");
  }
  next();
};

export default redirectIfAuthenticated;

