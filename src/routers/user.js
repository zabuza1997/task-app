const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth')
const router = new express.Router();
//Create user
router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const exist = await User.exists({
            email: req.body.email
        });
        if (exist) {
            return res.status(400).send("User already registered.")
        }
        const token = await user.generateAuthToken();

        await user.save();
        res.status(201).send({
            user,
            token
        });
    } catch (error) {
        res.status(400).send(error)
    }
})
//User login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        // const {
        //     password,
        //     tokens,
        //     ...info
        // } = user._doc;
        res.send({
            user,
            token
        })
    } catch (error) {
        res.status(400).send();
    }
})
//user log out
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
//Log out all sessions
router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send()
    } catch (error) {
        res.status(500).send();
    }
})
//Read one's own profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})
//Read users
// router.get('/users', async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })
//Read user
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// })
//Update user
router.patch('/users/:id', async (req, res) => {
    const _id = req.params.id;
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid updates'
        })
    }
    try {
        const user = await User.findById(_id);
        updates.forEach(update => {
            user[update] = req.body[update];
        })
        await user.save();
        if (!user) {
            return res.status(404).send();
        }
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})
//Delete user
router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(_id);
        if (!user) {
            return res.status(404).send({
                error: 'User not found'
            });
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;