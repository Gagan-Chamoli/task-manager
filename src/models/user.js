const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validator(value){
            if(!value.isEmail()){
                throw new Error('Email is invalid');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate (value){
            if(value<0){
                throw new Error('Age must be a positive number');
            }
        }
    },
    password: {
        type: String,
        require:true,
        minLength: 7,
        trim: true,
        validator (value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain password');
            }
        }
    }
})

userSchema.pre('save', async function (next){
    const user = this ;
    console.log('Just before saving!');

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User ;