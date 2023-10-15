import express from 'express';
import path from 'path';
import cookeParser from 'cookie-parser';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import expressValidator from 'express-validator';
import flash from 'connect-flash';
import session from 'express-session';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;
import mongoose from 'mongoose';
import index from './routes/index';
import users from './routes/users';
const { MongoClient } = require('mongodb');

async function main() {
 const uri = "mongodb://localhost:27017/?readPreference=primary&ssl=false&directConnection=true";
 const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

 try {
    await client.connect();
    const collection = client.db("test").collection("documents");
    const documents = await collection.find({}).toArray();
    console.log(documents);
 } catch (err) {
    console.error(err);
 } finally {
    await client.close();
 }
}

main().catch(console.error);


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/?readPreference=primary&ssl=false&directConnection=true', {
	useMongoClient: true
});
let db = mongoose.connection;

const app = express();
const PORT = 3000;

app.use(express.static(__dirname + '/public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookeParser());

app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator());

app.use(flash());

app.use(function(req, res, next){
	res.locals.success_message = req.flash('success_message');
	res.locals.error_message = req.flash('error_message');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
  	next();
});

app.use('/', index);
app.use('/users', users);



app.listen(PORT, function(){
	console.log('Server is running on',PORT);
});

const dbURI = 'mongodb://localhost:27017/?readPreference=primary&ssl=false&directConnection=true';

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});
