const path = require('path');
const express = require('express');
const hbs = require('hbs');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

//setup connection database
const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'Irpan@Ip1',
	database: 'course_school_ms',
});

//check connection database
conn.connect((err) => {
	if(err) throw err;
	console.log('mysql connected...');
});

app.use(fileUpload());

app.use(express.static('public'));
app.use(express.static('upload'));

//setup views engine, public assets and request data parser
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/assets', express.static(__dirname + '/public'));


//get all data students
app.get('/', (req, res) => {
	let sql = "SELECT * FROM students ORDER BY number_id DESC";
	let query = conn.query(sql, (err, results) => {
		if(err) throw err;
		res.render('students/index', {
			results: results
		});
	});
});

//store new data students 
app.post('/save', (req, res) => {
	
	
	let filePhoto = req.files.photo;
	let uploadPath = __dirname + '/public/upload/' + filePhoto.name;
	
	filePhoto.mv(uploadPath, function (err) {
		if(err) return res.status(500).send(err);

		let data = {number_id : req.body.number_id, 
		fullname : req.body.fullname, 
		photo : filePhoto.name,
		gender : req.body.gender,
		place_of_birth : req.body.place_of_birth, 
		date_of_birth : req.body.date_of_birth, 
		address : req.body.address};
		
		let sql = "INSERT INTO students SET ?";
		let query = conn.query(sql, data, (err, results) => {
			if(err) throw err;
			res.redirect('/');
		});

	});
 	
});

//update data student
app.post('/update', (req, res) => {

	let sql = null;
	if (!req.files.photo) {
		sql = `UPDATE students SET fullname='${req.body.fullname}', photo='${req.body.photo}', 
		gender='${req.body.gender}', place_of_birth='${req.body.place_of_birth}',
		date_of_birth='${req.body.date_of_birth}', address='${req.body.address}' WHERE number_id='${req.body.number_id}'`;
	} else {
		var filePhoto = req.files.photo;
		var uploadPath = __dirname + '/public/upload/' + filePhoto.name;

		sql = `UPDATE students SET photo='${filePhoto.name}', fullname='${req.body.fullname}', 
		gender='${req.body.gender}', place_of_birth='${req.body.place_of_birth}',
		date_of_birth='${req.body.date_of_birth}', address='${req.body.address}' WHERE number_id='${req.body.number_id}'`;
	}
	
	filePhoto.mv(uploadPath, function (err) {
		if(err) return res.status(500).send(err);

		let query = conn.query(sql, (err, results) => {
			if(err) throw err;
			res.redirect('/');
		});
	});
});

//delete data student
app.post('/delete', (req, res) => {
	let sql = `DELETE FROM students WHERE number_id=${req.body.number_id}`;
	let query = conn.query(sql, (err, results) => {
		if(err) throw err;
		res.redirect('/');
	})
});

//running app
app.listen(8000, () => {
	console.log('Server is running at http://localhost:8000');
});

