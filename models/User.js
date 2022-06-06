//models/ User.js
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs'); // hash işlemi için gerekli paketi dahil ediyoruz.
const jwt = require('jsonwebtoken');
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
//UserSchema Methods
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
module.exports = mongoose.model('User', UserSchema);
