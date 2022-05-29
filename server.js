//Projeye dahil edilecek packagelar, routlar ve Controllerlar burada yer alacak.
const express = require('express');
const dotenv = require('dotenv');
//Enviroment Variables //bu config ayarı en üstlerde olmalı
dotenv.config({
	path: './config/env/config.env'
});

const app = express();
const port = process.env.PORT; //Başka bir yerde 5040 portu geçerli olmaya bilir bize verilen portu kullanmak zorunda olabiliriz.
app.get('/', (req, res) => {
	res.send('Hello Question Answer Api ');
});
app.listen(port, () => {
	console.log(`App start on ${port}:${process.env.NODE_ENV}`);
});
