const mongoose = require('mongoose');
const slugify = require('slugify');
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
	},
	likes: [
		//Bizim burda like işlemlerinı tutmak için yapımız olacak.Burda giriş yapmış kullanıcıların idsini tutmamız gerekecek ve bir soruya çok fazla like gelebileceği için bir çok id olacak demmektir.bizim burda bu idleri array olarak tutmamız gerekecek. Bu arrayin her bir  elemanı da object bir tane object id olacak.
		{
			type: mongoose.Schema.ObjectId, //Burda bir sürü objectId olacak ve User a referance edecek.
			ref: 'User'
		}
	],
	answers: [
		//Like daki gibi her bir soruya binlerce cevap gelebilir bunun için array içinde tutucaz.yine object id tutucak fakat referansımız ise bu sefer Answer olacak
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Answer'
		}
	]
});
QuestionSchema.pre('save', function(next) {
	//eğer title değişmiş ise
	if (!this.isModified('title')) {
		//eğer title değişmemişse next diyerek devam ediyoruz.
		next();
	}
	//değişmiş ise makeSlug çağıracağız.
	this.slug = this.makeSlug();
	next();
});
QuestionSchema.methods.makeSlug = function() {
	return slugify(this.title, {
		replacement: '-', // replace spaces with replacement character, defaults to `-`
		remove: /[*+~.()'"!:@]/g, // remove characters that match regex, defaults to `undefined`
		lower: true // convert to lower case, defaults to `false`
	});
};
module.exports = mongoose.model('Question', QuestionSchema); //Modelimizi bu şekilde kayıt etmiş olacağız tabiki collectionımız Questions olarak oluşacak.
