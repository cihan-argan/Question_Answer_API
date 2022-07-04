const mongoose = require('mongoose');
const Question = require('../models/Question');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
	content: {
		type: String,
		required: [ true, 'Please provide a content' ],
		minlength: [ 20, 'Please provide content at least 20 characters' ]
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	likeCount: {
		type: Number,
		default: 0
	},
	likes: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}
	],
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	question: {
		type: mongoose.Schema.ObjectId,
		ref: 'Question',
		required: true
	}
});
AnswerSchema.pre('save', async function(next) {
	//Burada  answer save dediğiimizde save işlemi gerçekleşmeden hemen önce bizim oluşan answer id’imizi ilgili questionın answers kısmına eklemeye çalışacağız her answer.save()  dediğimizde yada answerımızı güncellediğimizde pre("save") çalışacak.Bunun için ilk başta kontrol yapmamız gerekekcek.Bu controlümüz question kısmındaki title değişmemiş ise next() diyerek işlemini direkt kayıt edecek demiştik benzer bir yöntem ile burda da user modifield edilmemiş ise direkt next diyerek answerı db ye kayıt edecek mantığımız bu şekilde olacak.

	if (!this.isModified('user')) {
		return next();
	}
	//Ancak user alanı değişmiş ise yani yeni bir cevap oluşturulmuş ise
	try {
		//Yeni eklenen answerın ilişkili olduğu question bulmak için,  bize saveden hemen önce o objemizi geleceği için this.question bize ilgili questionın idsini verecek. İdler elimize ulaştı..
		const question = await Question.findById(this.question);
		//questionu aldık zaten answer idsi _id olarak elimizde
		question.answers.push(this._id);
		// Answer modelde  olduğumuz  için  answer idsi şuanki elimizdeki id olduğu için this. _id ile ilgili questionın  question modelide bulunan  answers arrayi  içine ekliyoruz. ekledikten sonrada questionı alıp tekrardan veritabanına yazmamız gerekiyor sonucta güncelleme yapıldı.
		question.answerCount = question.answers.length;//Cevap sayısını question.answers.length uzunluğuna atadık.(aynısnı answerın silindiği yerdede yapmamız gerekekcek)
		await question.save();
		next();
	} catch (err) {
		console.log(err);
		return next(err);
	}
});

module.exports = mongoose.model('Answer', AnswerSchema);
