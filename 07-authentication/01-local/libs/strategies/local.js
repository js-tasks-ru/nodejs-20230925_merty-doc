const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

const localStrategyOptions = {
  usernameField: 'email',
  session: false,
};

const localStrategyFn = async (email, password, done) => {
  try {
    const user = await User.findOne({email});

    if (!user) {
      return done(null, false, 'Нет такого пользователя');
    }

    const isValidPassword = await user.checkPassword(password);

    if (!isValidPassword) {
      return done(null, false, 'Неверный пароль');
    }

    return done(null, user);
  } catch (error) {
    done(error);
  }
};

module.exports = new LocalStrategy(localStrategyOptions, localStrategyFn);
