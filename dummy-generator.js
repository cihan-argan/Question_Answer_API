const Question = require('./models/Question');
const Answer = require('./models/Answer');
const User = require('./models/User');
const fs = require('fs'); // Node js içindeki fileSystem i dahil ettik.
const connectDatabase = require('./helpers/database/connectDatabase');
const CustomError = require('./helpers/error/CustomErrors');

const dotenv = require('dotenv'); //dotenv dahil ettik

const path = './dummy/'; //pathe dummy folder yolunu attık.

const users = JSON.parse(fs.readFileSync(path + 'users.json')); //dummy/users.json dosyası içindeki verileri almasını sağladık
const questions = JSON.parse(fs.readFileSync(path + 'questions.json')); // dummy/question.json dosyası içindeki verileri almasını sağladık
const answers = JSON.parse(fs.readFileSync(path + 'answers.json')); //dummy/answers.json dosyası içindeki verileri almasını sağladık

dotenv.config({
	path: './config/env/config.env'
});

connectDatabase();

const importAllData = async function() {
	try {
		await User.create(users); //User database içinde users collectionı oluşturduk yukarıda json dosyasından aldığımız verileri ekledik
		await Question.create(questions); //Question database içinde questions collection oluşturdukyukarıda json dosyasından aldığımız verileri ekledik
		await Answer.create(answers); //Answer database içinde answers collection oluşturduk yukarıda json dosyasından aldığımız verileri ekledik
		console.log('Import Process Successful');
	} catch (err) {
		//Eklemede problem olursa burası çalışacak.
		console.log(err);
		console.err('There is a problem with import process');
	} finally {
		//process i sonlandırdık.
		process.exit();
	}
};

const deleteAllData = async function() {
	try {
		await User.deleteMany(); //User database içindeki verileri temizledik
		await Question.deleteMany(); //Question database içindeki verileri ve collectionı temizledik.
		await Answer.deleteMany(); //Answer database içindeki collection ve verileri temizledik.
		console.log('Delete Process Successful');
	} catch (err) {
		//temizleme işleminde bir problem olursa burası çalışacak
		console.log(err);
		console.err('There is a problem with delete process');
	} finally {
		//processi sonlandırdık.
		process.exit();
	}
};

if (process.argv[2] == '--import') {
	//--import argümanı gelirse bursı çalışacak
	importAllData();
} else if (process.argv[2] == '--delete') {
	//--delete argümanı gelirse burası çalışacak.
	deleteAllData();
}
