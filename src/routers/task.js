const express = require('express');
const router = new express.Router ;
const Task = require('../models/task.js');
const mongoose = require('mongoose');
const auth = require('../middleware/auth.js');

router.post('/tasks', auth,  async (req,res)=>{ 
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();    
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }  
});

router.get('/tasks', auth, async (req,res)=>{

    let match = {limit:2} ;
    var sort = 0 ;
    if(req.query.sortBy){
        sort = (req.query.sortBy.split(':')[1]=='asc')?1:-1;
    }

    try {
        match.owner = req.user._id ;

        if(req.query.completed){
            match.completed = (req.query.completed=='true')?true:false;
        }
        
        const tasks = await Task.find(match);    
    
        res.status(200).send(tasks);
    } catch (e) {
        res.status(500).send();        
    }
});

router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id ; 
    
    try {
        const task = await Task.findOne({_id, owner: req.user._id});     
        if(!task){
            return res.status(404).send();    
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
      }
});

router.patch('/tasks/:id', auth,  async (req,res)=>{

    const updates = Object.keys(req.body);
    const allowedUpdates = [ 'description', 'completed' ] ;
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update));  
    
    if(!isValidOperation){
        return res.status(400).send({'error':'invalid updates'});
    }
    
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id});
        
        if(task){
            updates.forEach(update=>task[update]=req.body[update]);
            await task.save();
            res.send(task);
        }
        res.status(404).send();
            
    } catch (error) {
        res.status(400).send(error);
    }
    
});

router.delete('/tasks/:id', auth,  async (req,res)=>{
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id});
        if(!task){
            return res.status(404).send();
        }
        
        res.send(task);    
    } catch (error) {
        res.status(400).send(error);
    }
    
});

module.exports = router ;