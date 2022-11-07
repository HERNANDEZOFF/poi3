const asyncHandler=require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler (async(req,res)=>{
    const{name,email,password,pic}=req.body;

    if(!name||!email||!password){
        
        res.status(400);
        throw new Error("Ingrese todos los campos");
    }   

    const userExits=await User.findOne({email});

    if(userExits){
        res.status(400);
        throw new Error("Ya existe ese usuario");
    }

    const user=await User.create({
        name, 
        email, 
        password, 
        pic,
    });

        if(user){
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email:user.email,
                pic: user.pic,
                token:generateToken(user._id),
            });
        }else{
            res.status(400);
            throw new Error("Error al crear usuario");
        }
});

const authUser = asyncHandler(async(req,res)=>{
   const{email,password} =req.body;

   const user=await User.findOne({email});

   if(user && (await user.matchPassword(password))){
    res.json({
        _id:user._id,
        name:user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
    });
   }else{
    res.status(401);
    throw new Error("Correo o contraseña invalida");
   }
});

module.exports={registerUser, authUser};
