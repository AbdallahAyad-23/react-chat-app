const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { validatePassword, genPassword } = require("../utils/password");

exports.signup = (req, res, next) => {
  const { username, password } = req.body;
  const { hash, salt } = genPassword(password);
  const user = new User({
    username,
    hash,
    salt,
  });
  User.findOne({ username })
    .then((existeduser) => {
      if (existeduser) {
        const error = new Error("This username is taken");
        error.data = { username: error.message };
        error.statusCode = 422;
        return next(error);
      }
      user.save().then((newUser) => {
        jwt.sign(
          { userId: newUser._id },
          process.env.SECRET,

          (err, token) => {
            return res.json({ token });
          }
        );
      });
    })

    .catch((err) => next(err));
};

exports.login = (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (!user) {
        const error = new Error("A user with this email could not be found.");
        error.data = { username: error.message };
        error.statusCode = 422;
        return next(error);
      }
      const isValid = validatePassword(req.body.password, user.hash, user.salt);
      if (isValid) {
        jwt.sign(
          { userId: user._id },
          process.env.SECRET,

          (err, token) => {
            return res.json({ token });
          }
        );
      } else {
        const error = new Error("password is incorrect");
        error.data = { password: error.message };
        error.statusCode = 422;
        return next(error);
      }
    })
    .catch((err) => next(err));
};
