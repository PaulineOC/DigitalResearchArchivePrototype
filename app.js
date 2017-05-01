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



function generalSearch(obj, word){
	word=word.trim().toLowerCase();
	console.log(word);
	console.log(obj.title);

	if(obj.title.includes(word)){
		console.log('title match');
		return true;
	}
	else if(subjectSearch(obj,word)){
		console.log("subject matc");
		return true;
	}
	else{
		return false;
	}
}

app.post('/searchbar',function(req,res){
	var fuzzy = new RegExp(".*"+req.body.searchterm.toLowerCase().trim()+".*");
	 var results=[];
	// museumObj.find({}).then(function(rs){
	// 	rs.forEach(function(ele){
	// 		console.log(ele.title);
	// 		if(generalSearch(ele, word)){
	// 			results.push(ele);
	// 		}
	// 	});
	// 	res.render('Search', {'generalterm':word, 'searchTerm': results});
	// });

	museumObj.find({ $or: [{ "title": fuzzy},{"subject": { $in: [req.body.searchterm.toLowerCase()]}},{"photographer": fuzzy}, {"identifier": fuzzy}, {"department": fuzzy}, {"collection": fuzzy}, {"repository": fuzzy}, {"coverage": fuzzy}]}, function(err, obj, count) {
		res.render('Search', {'searchTerm': obj, "generalterm":req.body.searchterm});
	});

});

app.get('/BrowseArchive',function(req,res){
	res.render('BrowseArchive');
});

app.get('/About', function(req,res){
	res.redirect('https://projects.invisionapp.com/share/R6BG6CVMJ#/screens/230769836');

});

app.get('/Features', function(req,res){
	res.redirect("https://projects.invisionapp.com/share/R6BG6CVMJ#/screens/230900189");

});


app.get('/Subject', function(req,res){
	res.render('subject');
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
		'title': req.body.title.toLowerCase(),
		'medium': req.body.medium.toLowerCase(),
		'photographer': req.body.photographer.toLowerCase(),
		'format': req.body.format.toLowerCase(),
		'date': req.body.date.toLowerCase(),
		'identifier': req.body.identifier.toLowerCase(),
		'originalIdentifier': req.body.originalIdentifier.toLowerCase(),
		'department': req.body.department.toLowerCase(), 
		'collection': req.body.collectiontype.toLowerCase(),
		'repository': req.body.repository.toLowerCase(),
		'onDisplay': bool,
		'summary': req.body.summary,
		'citation': req.body.citation, 
		'caption': req.body.caption, 
		'publisher': req.body.publisher, 
		'pic': base64,
	});
	//Further Material:
	if(req.body.subject){
		var splitSubject = req.body.subject.split(',,');
		for(var i=0;i<splitSubject.length;i++){
			splitSubject[i] = splitSubject[i].replace(/(\r\n|\n|\r)/gm,"");
			splitSubject[i].trim();
			splitSubject[i].toLowerCase();
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


var checkSubject = function(searchObj, refObj) {
	for (var i = 0; i < searchObj.subject.length; i++) {
		if (refObj.subject.includes(searchObj.subject[i])) {
			return true;
		}
	}
	return false;
}


var allObj=[];

app.get('/object/:slug',function(req,res){
	var results = [];
	museumObj.findOne({slug: req.params.slug}).then(function(obj1) {
		museumObj.find({}).then(function(rs){
			rs.forEach(function(ele){
				allObj.push(ele);
				if(ele.title != obj1.title && checkSubject(ele, obj1)){
					results.push(ele);
				}
			});//all elements
			res.render('Slug-Obj', {'object':obj1, 'related': results});
		});
	});
});



var subjectSearch = function(searchObj, term) {
	for (var i = 0; i < searchObj.subject.length; i++) {
		var test  = searchObj.subject[i].trim();
		test = test.toLowerCase();
		if(test === term){
			return true;
		}
	}
	return false;
}


app.post('/keyTerm',function(req,res){
	var results=[];
	var word =req.body.keyWord.toLowerCase().trim();

	museumObj.find({}).then(function(rs){
		rs.forEach(function(ele){
			if(subjectSearch(ele, word)){
				results.push(ele);
			}
		});
		res.render('Search', {'generalterm':word, 'searchTerm': results});
	});
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

