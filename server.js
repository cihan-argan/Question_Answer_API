//Projeye dahil edilecek packagelar, routlar ve Controllerlar burada yer alacak.
const express = require('express');
const dotenv = require('dotenv');
const connectDatabase = require('./helpers/database/connectDatabase');

const routers = require('./routers');
//Enviroment Variables //bu config ayarı en üstlerde olmalı
dotenv.config({
	path: './config/env/config.env'
});
//MONGO DB CONNECTİON
connectDatabase();

const app = express();
const port = process.env.PORT; //Başka bir yerde 5040 portu geçerli olmaya bilir bize verilen portu kullanmak zorunda olabiliriz.

//Routers Middleware
app.use('/api', routers);

app.listen(port, () => {
	console.log(`App start on ${port}:${process.env.NODE_ENV}`);
});
