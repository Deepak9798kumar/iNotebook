const express = require('express')
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser")


const JWT_SECRET = "Deepakisagoodb$oy"


//Create a User using POST "/api/auth/createuser", no Login require
router.post('/createUser', [
    body('name', 'Enter a Valid Name').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password must be atleast 8 Characters').isLength({ min: 8 }),
], async (req, res) => {
    //if there are error , return bad request and the error
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }
    //check weather the user with email exists already

    try {
        let user = await User.findOne({ email: req.body.email })

        if (user) {
            return res.status(400).json({ error: "sorry a user with the email already exist" })
        }

        const salt = await bcrypt.genSalt(10);
        console.log("salt", salt)
        const secpassword = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secpassword
        })
        console.log("password", secpassword)

        const data = {
            user: {
                id: user.id
            }
        }

        const auth = jwt.sign(data, JWT_SECRET);

        // res.json(user)
        res.json(auth)

    } catch (error) {
        console.log("error from catch=", error.message)
        res.status(500).send("some error occured")
    }
})


//Create a User using POST "/api/auth/login"
router.post('/login', [
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password cannot be blank').isLength({ min: 8 }),
], async (req, res) => {
    //if there are error , return bad request and the error
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "please try to login with correct credential" })
        }
        const comparepassword = await bcrypt.compare(password, user.password)
        if (!comparepassword) {
            return res.status(400).json({ error: "please try to login with correct credential" })
        }
        const data = {
            user: {
                id: user.id
            }
        }

        const auth = jwt.sign(data, JWT_SECRET);

        // res.json(user)
        res.json({auth})

    } catch (error) {
        console.log("error from catch=", error.message)
        res.status(500).send("some error occured")
    }
})


router.post("/getuser" ,fetchuser, async (req , res) => {
    try {
        const userId = req.user.id
        console.log("userid",userId)
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.log("error from catch=", error.message)
        res.status(500).send("some error occured")
    }
})

module.exports = router