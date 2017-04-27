var express = require('express');
var app = express();
var db = require('./db.js');
var path = require('path');
var bodyParser = require('body-parser');
var handlebars = require('hbs');

var mongoose = require('mongoose');
var museumObj = mongoose.model('MuseumObject');
mongoose.Promise = global.Promise;

//For Images
var fs = require('fs');
var multer = require('multer');
//Saves to memory storage 
var upload = multer({ storage: multer.memoryStorage({}) });

//Port setting
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
	museumObj.aggregate(
		[{ $sample: {size: 6} }], function(err,result){
			res.render('index' ,{layout: 'layout2.hbs', "results":result});
		});
});

app.post('/searchbar',function(req,res){
	console.log(req.body.searchterm);
	console.log(req.query.search);
	museumObj.find({ $or: [{ "accessionNum": req.query.search},{ "title": req.query.search}, { "manufacturer": req.query.search}, {"medium": req.query.search},{"maker": req.query.search}]}, function(err, obj, count) {
		res.render('Search', {'searchTerm': obj});
	});

});

app.get('/BrowseArchive',function(req,res){
	res.render('BrowseArchive');
});

app.get('/About', function(req,res){
	res.render('About');

});

app.get('/Features', function(req,res){
	res.render('About');

});

app.get('/AddObj',  function(req, res) {
	res.render('AddObj');
});

app.post('/AddObj',upload.single('pic'),function(req,res) {
	var base64 = req.file.buffer.toString('base64');
	
	var bool=false;
	if(req.body.onDisplay ===1 ){
		bool=true;
	}

	var newObj = new museumObj({
		'title': req.body.title,
		'medium': req.body.medium,
		'photographer': req.body.photographer,
		'format': req.body.format,
		'date': req.body.date,
		'identifier': req.body.identifier,
		'originalIdentifier': req.body.originalIdentifier,
		'department': req.body.department, 
		'collection': req.body.collectiontype,
		'repository': req.body.repository,
		'onDisplay': bool,
		'summary': req.body.summary,
		'citation': req.body.citation, 
		'caption': req.body.caption, 
		'publisher': req.body.publisher, 
		'pic': base64,
	});
	//Further Material:
	if(req.body.subject){
		var splitSubject = req.body.subject.split(',');
		for(var i=0;i<splitSubject.length;i++){
			splitSubject[i] = splitSubject[i].replace(/(\r\n|\n|\r)/gm,"");
			splitSubject[i].trim();
			newObj.subject.push(splitSubject[i]);
		}
	}
	newObj.save(function(err,item, count){
		if (err){
			console.log(err);
		}
		else{
			res.redirect('/');
		}
	});
});


app.post('/mapSearch',function(req,res){
	console.log(req.body);
	if(req.body.caseNum){
		museumObj.find({  "location": req.body.caseNum}, function(err, obj, count){
			if(err){
				console.log(err);
			}
			else{
			res.render('Search', {'searchTerm': obj});
			}
		});
	}
});


app.get('/object/:slug',function(req,res){
	museumObj.findOne({slug: req.params.slug},function(err, obj,count){
		res.render('Slug-Obj', {'object':obj});
	});
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

