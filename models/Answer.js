const mongoose = require('mongoose');
const schema = mongoose.Schema;
const AnswerSchema = new Schema({
	content: {
		//Her bir cevabın bir tane içeriği olmak zorunda
		type: String,
		required: [ true, 'Please provide a content' ],
		minlength: [ 10, 'Please provide a content at least 10 characters' ]
	},
	createdAt: {
		//Bu cevabın oluşturulma tarihi olacak.
		type: Date,
		default: Date.now
	},
	likes: [
		//Bu answerlarda beğenilebilir,Kim likeladı ise user id lerini depolayabiliriz.
		{
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		}
	],
	user: {
		//Bu answerı ekleyen bir user olacak
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	},
	question: {
		//Bu answer bir questiona ait olacak
		type: mongoose.Schema.ObjectId,
		ref: 'Question',
		required: true
	}
});
module.exports = mongoose.Model('Answer', AnswerSchema);
