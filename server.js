//Projeye dahil edilecek packagelar, routlar ve Controllerlar burada yer alacak.
const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./helpers/database/connectDatabase');
const customErrorHandler = require('./middlewares/errors/customErrorHandlers');
const path = require('path');

const routers = require('./routers');
//Enviroment Variables //bu config ayarı en üstlerde olmalı
dotenv.config({
	path: './config/env/config.env'
});
//MONGO DB CONNECTİON
connectDatabase();

const app = express();
//express - body middleware
app.use(express.json());
const port = process.env.PORT; //Başka bir yerde 5040 portu geçerli olmaya bilir bize verilen portu kullanmak zorunda olabiliriz.

//Routers Middleware
app.use('/api', routers);

//Error Handler
app.use(customErrorHandler);

//static files
//console.log(__dirname);//C:\Users\cihan\Desktop\Web_Egitim_2\Question_Answer_API e public ekle  demem gerekiyor(path i dahil etmem gerek)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
	console.log(`App start on ${port}:${process.env.NODE_ENV}`);
});
