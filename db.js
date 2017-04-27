var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');

 var MuseumObject = new mongoose.Schema({
  title: {type: String, default: ''},
  medium: {type: String, default: ''},
  photographer: {type: String, default: ''},
  format: {type: String, default: ''},
  date: {type: String, default: ''},
  identifier: {type: String, default: ''},
  originalIdentifier: {type: String, default: ''},
  department: {type: String, default: ''},
  collectionType: {type: String, default: ''},
  repository: {type: String, default: ''},
  //other fields

  onDisplay:  {type: Boolean, default: true},
  summary: {type: String, default: ''},
  citation: {type: String, default: ''},
  caption: {type: String, default: ''},

  publisher: {type: String, default: ''},
  subject: [String],
  coverage: {type: String, default: ''},
  pic: {type: String, default: ''},

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
 dbconf = 'mongodb://pauline:mongo123@ds115918.mlab.com:15918/heroku_kcl276gt';
//dbconf='mongodb://localhost/AMNH';
}

mongoose.connect(dbconf);