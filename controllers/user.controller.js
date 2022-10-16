const {
  signupService,
  findUserByEmailService,
  findUserByIdService,
} = require('../services/user.service');
const { generateToken } = require('../utils/token');

module.exports.signup = async (req, res) => {
  try {
    const user = await signupService(req.body);

    res.status(200).json({
      status: 'success',
      message: 'Successfully signed up',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'fail',
      error,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        status: 'fail',
        error: 'Please provide your credentials',
      });
    }

    const user = await findUserByEmailService(email);

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        error: 'No user found. Please create an account',
      });
    }

    const isPasswordValid = user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        status: 'fail',
        error: 'Wrom email or password',
      });
    }

    const token = generateToken(user);

    const { password: pass, ...others } = user.toObject();

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in',
      data: {
        user: others,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error,
    });
  }
};

module.exports.getMe = async (req, res) => {
  try {
    const user = await findUserByIdService(req.user?.id);

    const { password, ...others } = user.toObject();

    res.status(200).json({
      status: 'success',
      data: others,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      error,
    });
  }
};
