//models/ User.js
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs'); // hash işlemi için gerekli paketi dahil ediyoruz.

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: [ true, 'Please provide a name ' ]
	},
	email: {
		type: String,
		trim: true,
		lowercase: true,
		required: [ true, 'Please provide a email' ],
		unique: [ true, 'Please try different email' ], //bir e maile bir kullanıcı olacak
		match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a  valid email' ] //belirli taslakta mail yazılmalı boş bırakılamaz
	},
	role: {
		type: String,
		default: 'user',
		enum: [ 'user', 'admin' ]
	},
	password: {
		type: String,
		minlength: [ 6, 'please provide a password with min length 6' ], //6 char
		required: [ true, 'please provide a password' ], //password alanı zorunlu alandır.
		select: false // bu verileri daha sonra çekeceğimiz zaman password göremeyeceğiz.
	},
	createdAt: {
		type: Date, //kayıt olma tarihi
		default: Date.now //o anki tarihi
	},
	title: {
		type: String // zorunlu alan değil boş bırakılabilir.
	},
	about: {
		type: String
	},
	place: {
		type: String
	},
	website: {
		type: String
	},
	profile_image: {
		type: String,
		default: 'default.jpg'
	},
	bloked: {
		type: Boolean, //Admin tarafından block lanma durumu default false olacak.
		default: false
	}
});

UserSchema.pre('save', function(next) {
	//parola değişmemişse
	if (!this.isModified('password')) {
		//isModified içine yazdığımız alan değişmişse true değişmemişse false dönecek. önüne ! koyduğumuz için değişmediği durumu değerlendireceğiz.yani parolamamız değişmemişse burda direkt  aşşağıdaki işlemlere girmeden next() diyerek işlemlerime devam edicez.
		next();
	} //eğer parola değişmişse  if çalışmayacak alttaki kod bloğu çalışacak NOt:isModified mongoose içindeki bir metoddur.
	bcrypt.genSalt(10, (err, salt) => {
		if (err) next(err);
		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) next(err);
			this.password = hash;
			next();
		});
	});
});
module.exports = mongoose.model('User', UserSchema);
