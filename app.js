/// Library includes
var express = require('express'); // Express is our web framework
var sqlite3 = require('sqlite3'); // Allows us to access sqlite3 db files
var fs = require('fs'); // Lets us interact with the filesystem
var whiskers = require('whiskers'); // Loads the template engine

/// Configuration options
var db_fname = 'test.db'; // The name of the db we will store our data in
var port_num = 3000; // The port number at which the server is hosted on
// The directory containing static files
// Static files are not rendered or processed by the server in any way
// before being sent to the client
var static_dir = __dirname + '/static/'; 


// A simple function that initializes our database
function setup_db(fname)
{
    // Open the db
    var db = new sqlite3.Database(fname);

    console.log("Populating new database");

    // The callback that db.serialize() uses ensures that
    // all operations within it occur in series
    db.serialize( function () {

	// Creates a table called user with 2 columns
	// The first column is a string column. This stores usernames.
	// The second column is an integer column. This stores times.
	
	db.run("CREATE TABLE user (string not null, time integer);");
    });

    // Make sure to close the db again
    db.close();
}


// Only initialize the database if our db file does not exist
// The fs.exists() callback calls a function which accepts
// 1 parameter that expresses whether the file exists or not
fs.exists(db_fname, function(exists) {
    if (!exists)
	setup_db(db_fname);
});


/// Begin App routes here
var app = express();

// Do not change the order in which the app.use()
// statements occur
app.engine('.html', whiskers.__express);
app.use(express.bodyParser());
app.use(app.router);
app.use("/static", express.static(static_dir));

// Sets the property 'view' to the 'templates' subdir
// The template engine looks in 'view' to find templates
app.set('views', __dirname+'/templates');

// This is a simple get test
// It tests get parameter functionality
app.get('/test', function(req, res) {

    // If a name is given, then greet that name
    if ('name' in req.query)
	res.send('Hello: ' + req.query.name);
    else
	res.send('No name'); // Else no greeting
});


// This POST request accepts a name
// finds the time at which the request was made
// inserts the timestamp and the name into a database
// and then sends them back in the form 'name|timestamp'
// to the client.
app.post('/givename', function(req, res) {
    var name = req.param('name', null);
    if (name != null)
    {
	var time = Date.now(); // Grab the date
	res.send(name+'|'+time); // Create 'name|timestamp'
	var db = new sqlite3.Database(db_fname); // Open the db
	db.serialize(function(){ // Write values to the db
	    var stmt = db.prepare("INSERT INTO user VALUES (?, ?)");
	    stmt.run([name, time]); // Fill values into the ? placeholders
	    stmt.finalize();
	})
    }
    else
	res.send('error'); // Return an error if we received no name
});

app.get('/', function(req, res) {
    // Render the template for the main page.
    // This template accepts two parameters:
    // node_ver: The version of the current running NodeJS version
    // express_ver: The version of the current running ExpressJS version
    res.render('user_prompt.html', {node_ver: process.version, express_ver: express.version});
});


// Let the server actually listen on the port to dispatch requests
app.listen(port_num);
console.log('Listening on port ' + port_num);



