const express = require('express')
const router = express.Router()

const User = require('../models/User')



router.get('/', (req, res)=>{
    res.render('welcome')
})

router.get('/dashboard', async (req, res)=>{
    try {
        let user = await User.findOne({name: req.user.id}).lean()
        res.render('dashboard',{
            user
        })

    } catch (error) {
        console.log(error)
    }
})

module.exports = router