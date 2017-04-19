var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');

 var MuseumObject = new mongoose.Schema({
  identifier: {type: String, default: ''},
  title: {type: String, default: ''},
  format: {type: String, default: ''},
  coverage: {type: String, default: ''}, 
  publisher: {type: String, default: ''},
  photographer: {type: String, default: ''},
  repository: {type: String, default: ''},
  //specific to AMNH
  department: {type: String, default: ''},
  medium: {type: String, default: ''},
  date: {type: String, default: ''},
  coverage: {type: String, default: ''},
  subject: {type: String, default: ''},
  collectiontype: {type: String, default: ''},
//   furtherArticles: {type: Array},
//   furtherKeywords:[String],
//   pic: {type: String, default: ''},
});

 MuseumObject.plugin(URLSlugs('title'));
 mongoose.model('MuseumObject', MuseumObject);
 
// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV == 'PRODUCTION') {
  console.log("in production");
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 var fs = require('fs');
 var path = require('path');
 var fn = path.join(__dirname, 'config.json');
 var data = fs.readFileSync(fn);
 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 var conf = JSON.parse(data);
 var dbconf = conf.dbconf;
} 
else {
 // if we're not in PRODUCTION mode, then use
 //dbconf = 'mongodb://pauline:mongo123@ds115918.mlab.com:15918/heroku_kcl276gt';
 var dbconf='mongodb://localhost/AMNH1';
}

mongoose.connect(dbconf);