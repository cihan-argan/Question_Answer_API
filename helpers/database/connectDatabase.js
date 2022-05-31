//helpers>database>connectDatabase.js

const mongoose = require('mongoose');

const connectDatabase = () => {
	mongoose
		.connect(process.env.MONGO_URI, { useNewUrlParser: true }) //bize bir promise döndürecek
		.then(() => {
			console.log('Mongo DB Connection Successful..');
		})
		.catch((err) => {
			console.error(err);
		});
};

module.exports = connectDatabase;
//Server.js içinde bunu kullanacağız config kısmının hemen altında
