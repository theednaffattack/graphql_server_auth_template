import jwt from 'jsonwebtoken';
import _ from 'lodash';
import bcrypt from 'bcrypt';

export const createTokens = async (user, secret) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ['id']),
    },
    secret,
    {
      expiresIn: '20m',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    secret,
    {
      expiresIn: '7d',
    },
  );

  return Promise.all([createToken, createRefreshToken]);
};

export const refreshTokens = async (token, refreshToken, models, SECRET) => {
  let userId = -1;
  try {
    const { user: { id } } = jwt.verify(refreshToken, SECRET);
    userId = id;
  } catch (err) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  const [newToken, newRefreshToken] = await createTokens(user, SECRET);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const tryLogin = async (email, password, models, SECRET) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    // user with provided email not found
    // throw new Error('Invalid login'); // old error

    return {
      ok: false,
      errors: [{ field: 'email', message: 'Cannot find user with that email' }],
      authPayload: null,
    };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    // bad password
    // throw new Error('Invalid password');
    return {
      ok: false,
      errors: [{ field: 'password', message: 'Wrong password' }],
      authPayload: null,
    };
  }

  const [token, refreshToken] = await createTokens(user, SECRET);

  return {
    ok: true,
    errors: [],
    authPayload: {
      token,
      refreshToken,
    },
  };
};
