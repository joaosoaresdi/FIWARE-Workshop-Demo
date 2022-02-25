var broker = require('../../lib/broker_connection.js');
var express = require('express');
var fs = require('fs');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json()) // for parsing application/json
app.use(express.static('icons'));

async function sleep(millis) {
	return new Promise(resolve => setTimeout(resolve, millis));
}

app.get('/', function (req, res) {
	res.sendFile( __dirname + "/" + "index.html" );
});

app.get('/index.html', function (req, res) {
	res.sendFile( __dirname + "/" + "index.html" );
});

// ************************************************************************
// ************************ SMART TRASH APP METHODS ***********************// ************************************************************************

let trash_clients = [];
let trash_markers = new Map();

async function trashEventsHandler(request, response, next) {
	console.log("new Browser Client");
	
	const headers = {
		'Content-Type': 'text/event-stream',
		'Connection': 'keep-alive',
		'Cache-Control': 'no-cache'
	};

	let array =  Array.from(trash_markers, ([key, value]) => (value));
	const data = `data: ${JSON.stringify(array)}\n\n`;
	console.log(data);
	
	response.writeHead(200, headers);
	response.write(data.toLowerCase());
	
	const clientId = Date.now();
	
	const new_client = {
		id: clientId,
		response: response
	};
	
	trash_clients.push(new_client);
	
	request.on('close', () => {
		console.log(`${clientId} Connection closed`);
		trash_clients = trash_clients.filter(client => client.id !== clientId);
	});
}

app.get('/trash/events', trashEventsHandler);

async function sendTrashEventsToAll(marker) {
	var data = `data: ${JSON.stringify(marker)}\n\n`;
	console.log(data);
	console.log(trash_clients.length);
	console.log(trash_markers.size);
	
	for(var i = 0; i < trash_clients.length; i++) {
		if(trash_clients[i]) { 
			trash_clients[i].response.write(data);
		}
		else {
			trash_clients.splice(i,1);
		}
	}
	//trash_clients.forEach(client => {console.log(`${client.id}`); client.response.write(data);});
}

async function trashHandler(request, response, next) {
	console.log("from broker Handler");
	
	var key = request.body.data[0].id; //sensor_id
	var location = request.body.data[0].location.value; //location coords
	var ratio = request.body.data[0].ratio.value; //ration
	
	trash_markers.set(key, {'id':key, 'location':location, 'ratio':ratio});
	response.end('Ok');
	
	sendTrashEventsToAll([{'id':key, 'location':location, 'ratio':ratio}]);	
}

app.post('/trash/notify', trashHandler);

// ************************************************************************
// *********************** SMART PARKING APP METHODS **********************// ************************************************************************

let parking_clients = [];
let parking_markers = new Map();

async function parkingEventsHandler(request, response, next) {
	console.log("new Browser Client");
	
	const headers = {
		'Content-Type': 'text/event-stream',
		'Connection': 'keep-alive',
		'Cache-Control': 'no-cache'
	};
	
	let array =  Array.from(parking_markers, ([key, value]) => (value));
	const data = `data: ${JSON.stringify(array)}\n\n`;
	console.log(data);
	
	response.writeHead(200, headers);
	response.write(data);
	
	const clientId = Date.now();
	
	const new_client = {
		id: clientId,
		response: response
	};
	
	parking_clients.push(new_client);
	
	request.on('close', () => {
		console.log(`${clientId} Connection closed`);
		parking_clients = parking_clients.filter(client => client.id !== clientId);
	});
}

app.get('/parking/events', parkingEventsHandler);

async function sendParkingEventsToAll(marker) {
	var data = `data: ${JSON.stringify(marker)}\n\n`;
	console.log(data);
	console.log(parking_clients.length);
	console.log(parking_markers.size);
	
	for(var i = 0; i < parking_clients.length; i++) {
		if(parking_clients[i]) { 
			parking_clients[i].response.write(data);
		}
		else {
			parking_clients.splice(i,1);
		}
	}
	//trash_clients.forEach(client => {console.log(`${client.id}`); client.response.write(data);});
}

async function parkingHandler(request, response, next) {
	console.log("update from broker Handler");
	
	var key = request.body.data[0].id; //sensor_id
	var location = request.body.data[0].location.value; //location coords
	var capacity = request.body.data[0].capacity.value; //ration
	var ocupancy = request.body.data[0].ocupancy.value; //ration
	
	parking_markers.set(key, {'id':key, 'location':location, 'capacity':capacity, 'ocupancy':ocupancy});
	response.end('Ok');
	
	sendParkingEventsToAll([{'id':key, 'location':location, 'capacity':capacity, 'ocupancy':ocupancy}]);	
}

app.post('/parking/notify', parkingHandler);


// ************************************************************************
// *********************** AIR QUALITY APP METHODS **********************// ************************************************************************

let air_quality_clients = [];
let air_quality_markers = new Map();

async function airqualityEventsHandler(request, response, next) {
	console.log("new Browser Client");
	
	const headers = {
		'Content-Type': 'text/event-stream',
		'Connection': 'keep-alive',
		'Cache-Control': 'no-cache'
	};
	
	let array =  Array.from(air_quality_markers, ([key, value]) => (value));
	const data = `data: ${JSON.stringify(array)}\n\n`;
	console.log(data);
	
	response.writeHead(200, headers);
	response.write(data);
	
	const clientId = Date.now();
	
	const new_client = {
		id: clientId,
		response: response
	};
	
	air_quality_clients.push(new_client);
	
	request.on('close', () => {
		console.log(`${clientId} Connection closed`);
		air_quality_clients = air_quality_clients.filter(client => client.id !== clientId);
	});
}

app.get('/airquality/events', airqualityEventsHandler);

async function sendAirqualityEventsToAll(marker) {
	var data = `data: ${JSON.stringify(marker)}\n\n`;
	console.log(data);
	console.log(air_quality_clients.length);
	console.log(air_quality_markers.size);
	
	for(var i = 0; i < air_quality_clients.length; i++) {
		if(air_quality_clients[i]) { 
			air_quality_clients[i].response.write(data);
		}
		else {
			air_quality_clients.splice(i,1);
		}
	}
	//trash_clients.forEach(client => {console.log(`${client.id}`); client.response.write(data);});
}

async function airqualityHandler(request, response, next) {
	console.log("update from broker Handler");
	
	var key = request.body.data[0].id; //sensor_id
	var location = request.body.data[0].location.value; //location coords
	var temperature = request.body.data[0].temperature.value; //temperature
	var humidity = request.body.data[0].humidity.value; //humidity
	var pressure = request.body.data[0].pressure.value; //pressure
	var co2 = request.body.data[0].co2.value; //pressure
	
	air_quality_markers.set(key, {'id':key, 'location':location, 'temperature':temperature, 'humidity':humidity, 'pressure':pressure, 'co2':co2});
	response.end('Ok');
	
	sendAirqualityEventsToAll([{'id':key, 'location':location, 'temperature':temperature, 'humidity':humidity, 'pressure':pressure, 'co2':co2}]);	
}

app.post('/airquality/notify', airqualityHandler);


// *************************************************************************
// ************************ BROKER SUBSCRIPTION METHODS ********************// *************************************************************************

function create_subscription(app, sensor_type, attr_set) {
	return {
		description: `Subscription from ${app} to ${sensor_type} sensors on ${attr_set}`,
		subject: {
			entities: [
				{
					idPattern: '.*',
					type: sensor_type
				}
			],
			condition: {
				attrs: attr_set
			}
		},
		notification: {
			http: {
				url: `http://host.docker.internal:${app_port}/${app}/notify`
			},
			attrs: attr_set
		},
		expires: '2040-01-01T14:00:00.00Z'
	};
}

async function subscribeBroker(subscription, service, broker_port){
	console.log('subscribeBroker');
	console.log('service');
	var subs = await broker.subscribeBroker(JSON.stringify(subscription), service, broker_port);
	console.log(subs);
	if(subs === undefined) {
		console.log("Unable to Connect to Broker");
		console.log("Retrying in 5 seconds");
		await sleep(5000);
		subscribeBroker(subscription, service, broker_port);
	}	else {
		console.log("Connected to Broker:");
		console.log(subscription);
	}
}

var app_port = 3004;

// ************************ APP START METHODS ********************

var server = app.listen(app_port, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('Federated app listening at http://%s:%s', host, port)
})

const argv = process.argv.slice(2);
if(argv.length < 1) {
	console.log('Usage: node federated_app_logic.js broker_port=1030');
	process.exit(-1);
}

var broker_port = 1030;

//app, sensor_type, attr_set

var service = "trash_service";
var trash_subscription = create_subscription('trash', 'trash_sensor', ['location', 'ratio']); 
console.log(JSON.stringify(trash_subscription));
console.log(service);
subscribeBroker(trash_subscription, service, broker_port);

service = "parking_service";
var parking_subscription = create_subscription('parking', 'parking_sensor', ['location', 'capacity', 'ocupancy']); 
console.log(JSON.stringify(parking_subscription));
console.log(service);
subscribeBroker(parking_subscription, service, broker_port);

service = "air_quality_service";
var parking_subscription = create_subscription('airquality', 'airquality_sensor', ['location', 'temperature', 'humidity', 'pressure', 'co2']); 
console.log(JSON.stringify(parking_subscription));
console.log(service);
subscribeBroker(parking_subscription, service, broker_port);

