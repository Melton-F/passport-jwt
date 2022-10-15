const express = require('express')
const app = express()
const cors = require('cors')
const User = require('./database')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const passport = require('passport')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(passport.initialize())

require('./passport')


app.post('/signup', (req, res)=>{
    // res.send("you signed up.. thanks");
    bcrypt.hash(req.body.password, 10, (err, hash)=>{
        if(err){
            return res.status(500).json({
                status:"fail",
                error:err
            })
        }
        else{
            const user = new User({
                userName: req.body.userName,
                password: hash
            })
            user.save().then(result =>{
                res.status(200).json({
                    status:"success",
                    message:"user created",
                    user:{
                        id:result._id,
                        userName:result.userName
                    }
                })
            })

            // else{
            //     return res.status(500).json({
            //         status:"fail",
            //         message:"something failed on hashing the password"
            //     })
            // }
        }
    })
})

app.post('/login', (req, res)=>{
    // res.send("welcome")
    User.findOne({userName:req.body.userName}).then(user=>{
        if(user){
            
            bcrypt.compare(req.body.password, user.password, (err, result)=>{
                if(result){
                    const payload = {
                                userName:user.userName,
                                userId: user._id
                            }
                    const token = jwt.sign(payload, "something secret to be saved in the env", {expiresIn:"1d"})
                    return res.status(200).json({
                        status:"success",
                        message:"successfully logged in.... And here is your token...!!!",
                        token: "Bearer " + token
                    })
                }
                else{
                    return res.status(404).json({
                        status:"fail",
                        message: "Incorrect password"
                    })
                }
            })

        }else{

                res.status(404).json({
                status:"fail",
                message:"user not found"
            })
        }
    })
})

app.get('/protected', passport.authenticate('jwt', {session:false}), (req, res)=>{
    console.log(req.user);
    res.status(200).json({
        status:"success",
        message:"user details",
        user:{
            id:req.user._id,
            userName:req.user.userName
        }
    })
})

const PORT = 5000
app.listen(PORT, (req, res)=>{
    console.log(`server running on port: ${PORT}` );
})