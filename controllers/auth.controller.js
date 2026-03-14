const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const userModel = require("../models/index").user
const secret = process.env.JWT_SECRET || "simpanin"

exports.register = async (request, result) => {
  try {
    const {email, password} = request.body;
    const existingUser = await userModel.findOne({
      where: {email}
    });
    
    if (existingUser) {
      return result.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      email: email,
      password: hashedPassword
    });

    return result.status(201).json({
      success: true,
      message: "Register Success",
      data: user
    });

  } catch (error) {
    return result.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (request, result) => {
  try {
    let dataLogin = {
      email: request.body.email
    };
    let dataUser = await userModel.findOne({
      where: dataLogin
    });

    if (!dataUser) {
      return result.status(404).json({
        success: false,
        logged: false,
        message: "Authentication Failed. Email not found"
      });
    }

    const validPassword = await bcrypt.compare(
      request.body.password,
      dataUser.password
    );

    if (!validPassword) {
      return result.status(401).json({
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

    return result.json({
      success: true,
      logged: true,
      message: "Authentication Success",
      token: token
    });

  } catch (error) {
    return result.status(500).json({
      success: false,
      message: error.message
    });
  }
};