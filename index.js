const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

//setup connection database
const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'course_school_ms',
});

//check connection database
conn.connect((err) => {
	if(err) throw err;
	console.log('mysql connected...');
});

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
	let data = {number_id : req.body.number_id, 
		fullname : req.body.fullname, 
		place_of_birth : req.body.place_of_birth, 
		date_of_birth : req.body.date_of_birth, 
		address : req.body.address};
	let sql = "INSERT INTO students SET ?";
	let query = conn.query(sql, data, (err, results) => {
		if(err) throw err;
		res.redirect('/');
	}); 	
});

//running app
app.listen(8000, () => {
	console.log('Server is running at http://localhost:8000');
});