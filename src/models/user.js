const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        require: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    },
    password: {
        type: String,
        required: 'Password is required',
        trim: true,
        minLength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age is not valid')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})
//Prevent sending private data
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}
//Find user by credentials
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    });
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user;
}
//generate auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({
        _id: user._id.toString()
    }, 'fucklife123');
    user.tokens = user.tokens.concat({
        token
    });
    await user.save();
    return token;
};
//Hash plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})
const User = mongoose.model('User', userSchema)

module.exports = User