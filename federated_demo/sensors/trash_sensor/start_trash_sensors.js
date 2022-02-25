var fs = require('fs');
const readline = require('readline');
let sensor = require('./trash_sensor.js');
let TrashSensor = sensor.TrashSensor;

async function sleep(millis) {
	return new Promise(resolve => setTimeout(resolve, millis));
}

async function startSensors(sensor_locations, service, broker_port) {
	var ret = [];
	for (var i = 0; i < sensor_locations.length; i++) {
		var s = new TrashSensor(`trash_sensor_${i}`, 'trash_sensor', sensor_locations[i].lat, sensor_locations[i].long, Math.random().toFixed(2));
		ret.push(s);	
		try {
			var reg = await s.registerSensor(service, broker_port);
		} catch (error) {
			console.log('Error starting sensors!'); 
			throw error;
		}
	}
	return ret;
}

async function updateSensors(sensors, service, broker_port) {
	while(true) {
		for(var i = 0; i < sensors.length; i++) {
			console.log(`Updating sensor ${i}`);			 
			sensors[i].updateFillRatio(Math.random().toFixed(2), service, broker_port);
			await sleep(5000);
		}
	}
}

const argv = process.argv.slice(2);
if(argv.length < 3) {
	console.log('Missing arguments');
	console.log('Usage: node start_sensor.js filename service_name broker_port');
	process.exit(-1);
}

var filename = argv[0];
var service = argv[1];
var broker_port = parseInt(argv[2]);

  
let rawdata = fs.readFileSync(filename);
let sensor_locations = JSON.parse(rawdata);
console.log(sensor_locations);
console.log(service);
console.log(broker_port);

try {
	var sensors = startSensors(sensor_locations, service, broker_port);
} catch (error) {
	console.log('Error starting trash sensors');
	process.exit(-1);
}
sensors.then(sensors => updateSensors(sensors, service, broker_port)).catch( error => process.exit(-1));

