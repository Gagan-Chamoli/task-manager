const express = require('express');
const router = new express.Router ;
const User = require('../models/user.js');
const mongoose = require('mongoose');

router.post('/users', async (req,res)=>{ 
    const user = new User(req.body);
    
    try {
        await user.save() ;    
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/users', async (req,res)=>{
    try {
        const users = await User.find({});
        res.status(200).send(users);    
    } catch (e) {
        res.status(500).send(e)   
    }
});

router.get('/users/:id', async (req,res)=>{
    const _id = req.params.id ; 
    
    if (!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send({error: 'Invalid ID!'});
      }

    try {
        const user = await User.findById(_id)
        res.send(user);    
    } catch (error) {
        res.status(500).send()        
    }
});

router.patch('/users/:id', async (req,res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).send({error: 'Invalid Id'});
      }
    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email' , 'password', 'age'] ;
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));  
    
    if(!isValidOperation){
        return res.status(400).send({'error':'invalid updates'});
    }
    
    try {
        const user = await User.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true});
        
        res.send(user);    
    } catch (error) {
        res.status(400).send(error);
    }
    
});

router.delete('/users/:id', async (req,res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).send({error: 'Invalid Id'});
      }
    
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.send(user);    
    } catch (error) {
        res.status(400).send(error);
    }
    
});

module.exports = router;