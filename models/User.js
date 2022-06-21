//models/ User.js
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs'); // hash işlemi için gerekli paketi dahil ediyoruz.
const jwt = require('jsonwebtoken');
const Question = require('./Question');
const crypto = require('crypto');
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
		unique: true, //bir e maile bir kullanıcı olacak
		match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a  valid email' ] //belirli taslakta mail yazılmalı boş bırakılamaz
	},
	role: {
		type: String,
		enum: [ 'user', 'admin' ],
		default: 'user'
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
	},
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpire: {
		type: Date
	}
});
//UserSchema getResetPasswordTokenFromUser
UserSchema.methods.getResetPasswordTokenFromUser = function() {
	const { RESET_PASSWORD_EXPIRE } = process.env;
	const randomHexString = crypto.randomBytes(15).toString('hex'); //15 tane random bytlar üretecek bu password tokenın ne kadar uzun olmasını istiyorsanız o kadar belirtebilirsiniz.hexadecimal stringlere cevirmek için kullandık.

	const resetPasswordToken = crypto
		.createHash('SHA256') //Birçok algoritma var genelde bu kullanılır.
		.update(randomHexString) //Tokenımızı randomHexString vasıtası ile oluşturucaz.
		.digest('hex'); // digest hexadecimal olarak oluşturmak için belirtiyoruz.
	//console.log(resetPasswordToken); oluştu bunu UserSchema içindeki resetPasswordToken içine kayıtedicez.
	this.resetPasswordToken = resetPasswordToken;
	this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE); //config.env içinden atıcaz orada bu süreyi belirteceğiz.ms cinsinden olacak 1 saat vermek için 1 saat = 3600 000 ms verdik//şuandan 1 saat sonrası olacak
	return resetPasswordToken;
};

//UserSchema Methods Token
UserSchema.methods.generateJWTFromUser = function() {
	//secret key ve ExpiresIn Süremizi config.env içinde aldığımız için bunu kullanabilmek için aktif etmeliyiz
	const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

	//jwt oluşturmak için bir tane payload oluşturmamız gerekiyo jwt.io sitesindeki gibi obje olacak
	const payload = {
		id: this._id, //Şuanki kayıta ait id
		name: this.name
	};
	//.sign fonksiyonu oluşturucaz senkron olanını kullanacağız ilk başta payload umuzu vereceğiz.sonra secret key vereceğiz daha sonrada optional olarak algorthm verebiliriz ama biz burda sadece expiresIn suremizi vereceğiz.Bunlarda config.env içinde oluşturduk yukarıda dahil ettik.
	const token = jwt.sign(payload, JWT_SECRET_KEY, {
		expiresIn: JWT_EXPIRE
	});
	return token;
};

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
UserSchema.post('remove', async function() {
	await Question.deleteMany({
		//bir çok question silineceği için deleteMany methodunu kullanıyoruz
		user: this._id
		//Buradaki işlem o userımızın id si ile eşleşen birden fazla soru varsa o kaldırılacak
	});
});
module.exports = mongoose.model('User', UserSchema);
