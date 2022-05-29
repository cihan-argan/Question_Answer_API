//Projeye dahil edilecek packagelar, routlar ve Controllerlar burada yer alacak.
const express = require('express');
const app = express();
const PORT = 5040 || process.env.PORT; //Başka bir yerde 5040 portu geçerli olmaya bilir bize verilen portu kullanmak zorunda olabiliriz.

app.get('/', (req, res) => {
	res.send('Hello Question Answer Api ');
});
app.listen(PORT, () => {
	console.log(`App start on ${PORT}`);
});
