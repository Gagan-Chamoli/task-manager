const express = require('express');
const router = new express.Router ;
const User = require('../models/user.js');
const mongoose = require('mongoose');
const auth = require('../middleware/auth.js');
const multer = require('multer');
const upload = multer({
    dest: 'avatar'
});

router.post('/users', async (req,res)=>{ 
    const user = new User(req.body);
    
    try {
        await user.save() ;
        const token = await user.generateAuthToken();    
        res.status(201).send({user,token});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.send({user , token});
    }
    catch(e){
        res.status(400).send();
    }
});

router.get('/users/me', auth , async (req,res)=>{
    res.send(req.user);
});

router.patch('/users/me', auth ,async (req,res)=>{
   
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email' , 'password', 'age'] ;
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));  
    
    if(!isValidOperation){
        return res.status(400).send({'error':'invalid updates'});
    }
    
    try {
        const user = await User.findById(req.user._id) ;

        updates.forEach((update)=>user[update]=req.body[update]);
        
        await user.save();
        
        res.send(user);    
    } catch (error) {
        res.status(400).send(error);
    }
    
});

router.delete('/users/me', auth ,async (req,res)=>{
    try {
        await req.user.remove(req.user._id);
        res.send(req.user);    
    } catch (error) {
        res.status(400).send(error);
    }
    
});

router.post('/users/logout', auth,  async (req,res)=>{
     try{
         req.user.tokens = req.user.tokens.filter(token=>token.token !== req.token);
            console.log(req.user.tokens);
         await req.user.save();
          res.send();
     }
     catch(e){
         res.status(500).send();
     }
});

router.post('/users/logoutAll', auth, async (req,res)=>{
    try{
        req.user.tokens = [] ;
        await req.user.save();
        res.send();
    }
    catch(e){
        res.send(500).send();
    }
});

router.post('/users/me/avatar', upload.single('avatar') , (req,res)=>{
    res.send();
});

module.exports = router;