const express = require('express');
const router = new express.Router ;
const Task = require('../models/task.js');
const mongoose = require('mongoose');

router.post('/tasks', async (req,res)=>{ 
    const task = new Task(req.body);
    
    try {
        await task.save();    
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }  
});

router.get('/tasks', async (req,res)=>{
    try {
        const tasks = await Task.find({});    
        res.status(200).send(tasks);
    } catch (e) {
        res.status(500).send(e)        
    }
});

router.get('/tasks/:id', async (req,res)=>{
    const _id = req.params.id ; 
    
    if (!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(400).send({error: 'Invalid ID!'})
      }
      try {
        const task = await Task.findById(_id)      
        res.send(task);
    } catch (error) {
        res.status(500).send();
      }
});

router.patch('/tasks/:id', async (req,res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).send({error: 'Invalid Id'});
      }
    
    const updates = Object.keys(req.body);
    const allowedUpdates = [ 'description', 'completed' ] ;
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));  
    
    if(!isValidOperation){
        return res.status(400).send({'error':'invalid updates'});
    }
    
    try {
        const task = await Task.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true});
        
        res.send(task);    
    } catch (error) {
        res.status(400).send(error);
    }
    
});

router.delete('/tasks/:id', async (req,res)=>{
    if (!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).send({error: 'Invalid Id'});
      }
    
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        res.send(task);    
    } catch (error) {
        res.status(400).send(error);
    }
    
});

module.exports = router ;