//Helpers/ error / CustomError.js
class CustomError extends Error {
	//kendi error classımızı javascript içindeki Error classı içine extend edicek.
	constructor(message, status) {
		//bu messajı direkt Error classı içerisinden başlatabiliriz bunuda super() metodu ile gerçekleştiriyoruz.status mevcut olmadığı için bunu biz this. ile belirtiyoruz.
		super(message);
		this.status = status;
	}
}
module.exports = CustomError;
