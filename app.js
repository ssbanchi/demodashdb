var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var ibmdb = require('ibm_db');


var app = express();

// all environments
app.set('port', 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
var db2;
var hasConnect = false;

// Set VCAP environment variable to run program locally
//process.env['VCAP_SERVICES'] = '{"dashDB": [ { "name": "myDash","label": "dashDB", "plan": "Entry", "credentials": {"port": 50000,"db": "BLUDB",  "username": "dash101635","host": "awh-yp-small02.services.dal.bluemix.net","https_url": "https://awh-yp-small02.services.dal.bluemix.net:8443","hostname": "awh-yp-small02.services.dal.bluemix.net","jdbcurl":"jdbc:db2://awh-yp-small02.services.dal.bluemix.net:50000/BLUDB","uri": "db2://dash101635:5rSE5Shkj3Yy@awh-yp-small02.services.dal.bluemix.net:50000/BLUDB","password": "5rSE5Shkj3Yy" } } ]}';
//"dashDB": [ { "name": "dashDB-ul", "label": "dashDB", "plan": "Entry", "credentials": { "port": 50000, "db": "BLUDB", "username": "dash6086", "ssljdbcurl": "jdbc:db2://dashdb-entry-yp-dal09-07.services.dal.bluemix.net:50001/BLUDB:sslConnection=true;", "host": "dashdb-entry-yp-dal09-07.services.dal.bluemix.net", "https_url": "https://dashdb-entry-yp-dal09-07.services.dal.bluemix.net:8443", "dsn": "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-dal09-07.services.dal.bluemix.net;PORT=50000;PROTOCOL=TCPIP;UID=dash6086;PWD=Y6cMyT3BAPgc;", "hostname": "dashdb-entry-yp-dal09-07.services.dal.bluemix.net", "jdbcurl": "jdbc:db2://dashdb-entry-yp-dal09-07.services.dal.bluemix.net:50000/BLUDB", "ssldsn": "DATABASE=BLUDB;HOSTNAME=dashdb-entry-yp-dal09-07.services.dal.bluemix.net;PORT=50001;PROTOCOL=TCPIP;UID=dash6086;PWD=Y6cMyT3BAPgc;Security=SSL;", "uri": "db2://dash6086:Y6cMyT3BAPgc@dashdb-entry-yp-dal09-07.services.dal.bluemix.net:50000/BLUDB", "password": "Y6cMyT3BAPgc"  }  } ]

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
	if (env['dashDB']) {
        hasConnect = true;
		db2 = env['dashDB'][0].credentials;
	}
	
}

if ( hasConnect == false ) {

   db2 = {
        db: "BLUDB",
        hostname: "xxxx",
        port: 50000,
        username: "xxx",
        password: "xxx"
     };
}

var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

app.get('/', routes.listSysTables(ibmdb,connString));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});