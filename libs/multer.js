var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, callback) { // путь
        callback(null, './public/uploads/');
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname); // файл що записати, він буде тогови вигляду - 123748923498-(ім'я файлу).(тип файлу) і тут калбек
    }
});

var upload = multer({ storage: storage });

module.exports = upload; // експортуємо (робимо свою міні бубліотеку - фабрику) 

// це для збереження файлів на сервері


