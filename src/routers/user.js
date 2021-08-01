const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");

//Create user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    const exist = await User.exists({
      email: req.body.email,
    });
    if (exist) {
      return res.status(400).send("User already registered.");
    }
    const token = await user.generateAuthToken();

    await user.save();
    res.status(201).send({
      user,
      token,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});
//User login
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    // const {
    //     password,
    //     tokens,
    //     ...info
    // } = user._doc;
    res.send({
      user,
      token,
    });
  } catch (error) {
    res.status(400).send();
  }
});
//user log out
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});
//Log out all sessions
router.post("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
});
//Read one's own profile
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});
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
router.patch("/users/me", auth, async (req, res) => {
  // const _id = req.params.id;
  const allowedUpdates = ["name", "age", "email", "password"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({
      error: "Invalid updates",
    });
  }
  try {
    // const user = await User.findById(_id);
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    // if (!user) {
    //     return res.status(404).send();
    // }
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});
//Delete user
router.delete("/users/me", auth, async (req, res) => {
  // const _id = req.params.id;
  try {
    // const user = await User.findByIdAndDelete(_id);
    // if (!user) {
    //     return res.status(404).send({
    //         error: 'User not found'
    //     });
    // }
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});
//File uploading

const upload = multer({
  // dest: 'avatars',
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload only image files "));
    }
    cb(undefined, true);
  },
});
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .png()
      .resize({ height: 250, width: 250 })
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send();
  },
  (error, req, res, next) => {
    res.status(400).send({
      error: error.message,
    });
  }
);
//Deleting avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
});
//get user avatar
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set({
      "Content-Type": "image/jpg",
    });
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});
module.exports = router;
