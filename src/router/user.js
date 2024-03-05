const prisma = require("../db/prisma");
const { userAuth } = require("../middleware/auth");
const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const { generateAuthToken } = require("../utils/auth");

router.post("/signup", async (req, res, next) => {
  try {
    const require = ["name", "email", "password"];

    const missing = require.filter((key) => !req.body[key]);
    if (missing.length) {
      return res
        .status(400)
        .send({
          status: "error",
          message: `Please provide ${missing.join(", ")}`
        });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).send({
        status: "error",
        message: "Invalid email"
      });
    }

    const userCheck = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (userCheck) {
      return res.status(400).send({
        status: "error",
        message: "User already exists",
      })
    }

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
      },
    });

    res.status(200).send({
      status: "success",
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const require = ["email", "password"];

    const missing = require.filter((key) => !req.body[key]);
    if (missing.length) {
      return res
        .status(400)
        .send({
          status: "error",
          message: `Please provide ${missing.join(", ")}`
        });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(400).send({
        status: "error",
        message: "Invalid credentials"
      });
    }

    const token = await generateAuthToken(user);

    res.send({
      status: "success",
      message: "User logged in successfully",
      token: token,
    });
  } catch (error) {
    next(error);
  }
});

router.use(userAuth);

router.post("/logout", async (req, res, next) => {
  try {
    res.send({
      status: "success",
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}
);

module.exports = router;