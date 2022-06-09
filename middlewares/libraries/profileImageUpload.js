//multer dahil et
const multer = require('multer'); //multer dahil edildi
const path = require('path'); //path dahil edildi
const CustomError = require('../../helpers/error/CustomErrors'); //hatalar için CustomError dahil edildi

//İlk olarak storage ayarı yapılacak daha sonra filefilter filtreleme ayarı yapılacak
//storage nereye kaydedilecek ve hangi isimle kaydedilecek bunu belirtecek.
//fileFilter da bize hangi dosyaları izin vereceğimizi belirtecek.

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		//request,yüklenecek dosya, callback => hata yada dosyagöndermek işlemlerine devam etmek için
		//ilk başta dosya nereye oluşturulacak public altındaki uploads kısmına oluşturucaz biz ilk başta server.js te __dirname yapmıştık.bu o anki dosyanın yolunu verdiği için(middleware/libraries/profileImageUploads) bu işimize yaramayacak.bizim root directorysini bulmamız gerekiyor bunun için path ten yararlanacağız
		const rootDir = path.dirname(require.main.filename); //yani main dosyamızın yani server.js in nerde olduğunu bize verecek.Dosyamızı nereye atacağızmızı biliyoruz public/uploads altına atıcaz bunun içinde
		cb(null, path.join(rootDir, '/public/uploads')); //biz hata olmadığını varsayarak null yazdık hata olunca ilk parametre err olacak daha sonra önceden de kullandığımız path.join(rootDir,"/public/uploads");şeklinde server.js dir inin yanına atacağımız yolu ekledik
	},
	filename: function(req, file, cb) {
		//attığımız fotonun file name i ne olacak bunu belirlicez.
		//Postmanden atılan file-mimetype var => image/jpg,png,gif şeklinde biz bu uzantıyı nasıl alıcaz / a göre ayırıcaz / tan sonraki birinci indexi almaya çalışacağız.
		const extension = file.mimetype.split('/')[1];
		req.savedProfileImage = 'image_' + req.user.id + '.' + extension; //multer bir middleware olduğu için buraya request geliyor biz bu requesti içinde .savedProfileImage şeklinde bir tane değer oluşturuyoruz.biz bu değerimizi db ye kaydettiğimiz zaman kullanıcaz burda bir file name de db ye aynı isimle kaydetmemiz gerekiyor req.user.id o anki bulunan kullanıcımız ( bizim bir tane daha middleware çalışacak getAccessToRoute yani burdan geçtikten sonra bu işlem çalışacak.burdan geçtikten sonra req.user ımız oluşuyo onunda bir id si vardı onu eklicez. sonra . eklicez ve sonunada uzantısını eklicez.)
		cb(null, req.savedProfileImage); //cb ye diyoruzki bu isimle kayedet hata yokmuş gibi yaptık.
	}
});
const fileFilter = (req, file, cb) => {
	//bizim izin verdiğimiz belli standartlar var belli mimetype lar var önce bunları oluşturucaz.
	let allowedMimeTypes = [ 'image/jpg', 'image/gif', 'image/jpeg', 'image/png' ];
	if (!allowedMimeTypes.includes(file.mimetype)) {
		//image/pdf olursa true olacak ve buraya girecek burda bir hata fırlatacağız.
		return cb(new CustomError('Please provide a valid  image file.', 400), false); //hata fırlatıcaz ikinci parametre ise dosya işlemine devam etmeyeceğimiz için false değeri vericez.
	}
	return cb(null, true); //hata çıkmaz ise ilk parametre de null ikinci parametrede true giricez ki foto upload işlemi devam etsin.
};
//bu iki fonk yardımıyla multerımızı configure edebiliriz

const profileImageUpload = multer({ storage, fileFilter });
module.exports = profileImageUpload;
