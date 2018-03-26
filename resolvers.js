import bcrypt from 'bcrypt';
import { PubSub } from 'graphql-subscriptions';
import _ from 'lodash';
import joinMonster from 'join-monster';

import { requiresAuth } from './permissions';
import { refreshTokens, tryLogin } from './auth';

export const pubsub = new PubSub();

const VOTE_HAPPENED = 'VOTE_HAPPENED';

export default {
  Subscription: {
    voteHappened: {
      subscribe: () => pubsub.asyncIterator(VOTE_HAPPENED),
    },
  },
  Query: {
    allPolls: (parent, args, { models }, info) =>
      joinMonster(
        info,
        args,
        sql => models.sequelize.query(sql, { type: models.sequelize.QueryTypes.SELECT }),
        { dialect: 'pg' },
      ),
    poll: (parent, args, { models }, info) =>
      joinMonster(
        info,
        args,
        sql => models.sequelize.query(sql, { type: models.sequelize.QueryTypes.SELECT }),
        { dialect: 'pg' },
      ),
  },

  Mutation: {
    register: async (parent, args, { models }) => {
      const hashedPassword = bcrypt.hash(args.password, 12);
      try {
        const user = await models.User.create({
          ...args,
          password: hashedPassword,
        });

        return {
          ok: true,
          errors: [],
          user,
        };
      } catch (error) {
        console.log(error);
        return {
          ok: false,
          errors: [{ field: 'email', message: 'something went wrong' }],
          user: null,
        };
      }
    },
    login: async (parent, { email, password }, { models, SECRET }) =>
      tryLogin(email, password, models, SECRET),
    // refreshTokens: (parent, { token, refreshToken }, { models, SECRET }) =>
    //   refreshTokens(token, refreshToken, models, SECRET),
    // createBook: async (parent, args, { models }) => {
    //   const book = await models.Book.create(args);
    //   return {
    //     ...book.dataValues,
    //     authors: [],
    //   };
    // },
    // createAuthor: async (parent, args, { models }) => {
    //   const author = await models.Author.create(args);
    //   return {
    //     ...author.dataValues,
    //     books: [],
    //   };
    // },
    // addBookAuthor: async (parent, args, { models }) => {
    //   await models.BookAuthor.create(args);
    //   return true;
    // },
  },
};
