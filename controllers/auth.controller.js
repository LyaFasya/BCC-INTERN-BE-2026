const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/index").user;
const secret = process.env.JWT_SECRET || "simpanin";

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({
      where: {email}
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email: email,
      password: hashedPassword
    });

    return res.status(201).json({
      success: true,
      message: "Register Success",
      data: user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    let dataLogin = {
      email: req.body.email
    };
    let dataUser = await userModel.findOne({
      where: dataLogin
    });

    if (!dataUser) {
      return res.status(404).json({
        success: false,
        logged: false,
        message: "Authentication Failed. Email not found"
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      dataUser.password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        logged: false,
        message: "Authentication Failed. Invalid password"
      });
    }

    let payload = {
      id: dataUser.id,
      email: dataUser.email
    };

    let token = jwt.sign(payload, secret, {
      expiresIn: "1d"
    });

    return res.json({
      success: true,
      logged: true,
      message: "Authentication Success",
      token: token
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};