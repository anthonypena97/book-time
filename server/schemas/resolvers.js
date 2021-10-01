const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { saveBook } = require('../../client/src/utils/API');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('savedBooks')

                return userData;
            }

            throw new AuthenticationError('Not logged in');
        }
    },
    Mutations: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const book = await Book.create({ ...args, username: context.user.username });

                const updatedSave = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: book._id } },
                    { new: true }
                ).populate('savedBooks');;

                return updatedSave;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (parent, { bookId }, context) => {

            const updatedSave = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: bookId } },
                { new: true }
            ).populate('savedBooks');

            return updatedSave;

        },
    }
};

module.exports = resolvers;