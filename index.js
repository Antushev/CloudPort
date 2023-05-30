// Подключение пакетов, которые необходимы для разработки
// серверной части облачного сервиса
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

// Указание порта работы сервера Express.js
const PORT = 3334;

// Предварительная настройка сервера Express.js
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

// Создание точки доступа API для тестирования
app.get('/test', (req, res) => {
	res.send(JSON.stringify({getJSON: 'JSON'}));
});

// Создание точки доступа API для передачи списка файлов
// на облачный сервис при подключении съёмного носителя
app.post('/files', (req, res) => {
	if (!req.body) {
		res.send(JSON.stringify({messageServer: 'Данные не отправлены...'}));
	} else {
		const filesList = req.body;

		fs.open('/var/www/html/files-list.json', 'w', (error) => {
			if (error) throw error;
			console.log('File created');
		});

		fs.appendFile('/var/www/html/files-list.json', JSON.stringify(req.body), (error) => {
			if (error) throw error;

			console.log('Data writing!');
		});
	}
});

// Создание точки доступа API для скачивания файла
// на облачный сервис при запросе
app.post('/file-download', (req, res) => {
	if (!req.body) {
		res.send(JSON.stringify({messageServer: 'Файл не отправлен...'}));
	} else {
		console.log(req.body);
	}
});

// Создание точки доступа API для скачивания нескольких файлов
// на облачный сервис при запросе
app.get('/get-files', (req, res) => {
	const dirGetFiles = '/var/www/html/device/get_files';
	const filesInDir = [];

	fs.readdir(dirGetFiles, (error, files) => {
		files.forEach((file) => {
			fs.rename(dirGetFiles + '/' + file, dirGetFiles + '/' + file.replace('flash\\', ''), (error) => {
		
			});
		})
	});

	fs.readdir(dirGetFiles, (error, files) => {
		res.send(JSON.stringify(files));
	});
});

// Создание точки доступа API для получения статуса
// портативного устройства обмена
app.get('/get-online-device', (req, res) => {
	const dirFileOnlineDevice = '/var/www/html/device/file-online-device.txt';

	fs.access(dirFileOnlineDevice, (error) => {
		if (error) {
			res.send(JSON.stringify({online: false}));
		} else {
			res.send(JSON.stringify({online: true}));
		}
	});
});


// Запуск сервера Express.js
app.listen(PORT, () => {
	console.log(`Application listening port ${PORT}`);
});
