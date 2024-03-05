const jwt = require("jsonwebtoken");

exports.generateAuthToken = async (user) => {
  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
  return token;
};