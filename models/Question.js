const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
	title: {
		//Questionların bir adet title olacak
		type: String, //string tipinde olacak
		required: [ true, 'Please provide a title ' ], //zorunlu bir alan olacak
		minlength: [ 10, 'Please provide a title at least 10 characters' ], //Min 10 karakterden oluşacak
		unique: true //tekil olacak aynısından olmayacak.
	},
	content: {
		// her sorunun içeriği  olacak
		type: String,
		required: [ true, 'Please provide a content' ],
		minlength: [ 20, 'Please provide a title at least 20 characters' ] //Min 20 karakterden oluşacak.
	},
	slug: String, //slug = wpokulu.com /wordpress-temalar/ucresiz => wordpress-temalar/ucretsiz dediğimiz kısım adress kısa adı diye geçer Her bir sorunun slug alanı olacak //Not sadece type vereceksek bu şekilde tanımlama yapabiliriz.
	createdAt: {
		//Sorunun oluşturulma zamanı tipi date olacak defaultu oluşturulduğu an olacak.
		type: Date,
		default: Date.now
	},
	user: {
		//Kimin oluşturduğunu vermemiz gerekecek tipi objectId olacak.
		type: mongoose.Schema.ObjectId,
		required: true,
		//User ve questions ilişkisini belirtmek için bizim bunu user modelimize bağlamamız gerekiyor.yani referansını vermemiz gerekiyor.
		ref: 'User'
	}
});
module.exports = mongoose.model('Question', QuestionSchema); //Modelimizi bu şekilde kayıt etmiş olacağız tabiki collectionımız Questions olarak oluşacak.
