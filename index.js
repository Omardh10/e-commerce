const express = require('express');
const app = express();
const dotenv = require('dotenv');
const userroute=require('./routes/users');
const routecateg=require('./routes/categories');
const routeprudect=require('./routes/prudects');
const routeorder=require('./routes/orders');
const routpasswod=require('./routes/password');
// const mongoose=require('mongoose');
const { ConnectToDb } = require('./utils/db');
dotenv.config();
app.use(express.json());

// mongoose.connect("mongodb://localhost/shopdb").then(()=>{
//     console.log("connect to db");
    
// })
ConnectToDb();

app.use('/api/users',userroute);
app.use('/api/categories',routecateg);
app.use('/api/products',routeprudect);
app.use('/api/orders',routeorder);
app.use('/api/password',routpasswod );



app.use((req, res, next) => {
    const error = new Error('this page not found');
    res.status(404)
    next(error);
})
app.use((error, req, res, next) => {
    res.status(404).json({ message: error.message })
})

app.listen(3000,()=>{
    console.log("server on port 3000");
    
})