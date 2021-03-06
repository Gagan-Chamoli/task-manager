const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user.js');
const taskRouter = require('./routers/task.js')
const nodemailer = require('nodemailer');
const PORT = process.env.PORT ;

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, ()=>console.log(`Server up at port ${PORT}`));