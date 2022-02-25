var fs = require('fs');
const readline = require('readline');
let sensor = require('./trash_sensor.js');
let TrashSensor = sensor.TrashSensor;

async function sleep(millis) {
	return new Promise(resolve => setTimeout(resolve, millis));
}

async function startSensors(sensor_locations, service) {
	var ret = [];
	for (var i = 0; i < sensor_locations.length; i++) {
		var s = new TrashSensor(`trash_sensor_${i}`, 'trash_sensor', sensor_locations[i].lat, sensor_locations[i].long, Math.random().toFixed(2));
		ret.push(s);	
		try {
			var reg = await s.registerSensor(service);
		} catch (error) {
			console.log('Error starting sensors!'); 
			throw error;
		}
	}
	return ret;
}

async function updateSensors(sensors, service) {
	while(true) {
		for(var i = 0; i < sensors.length; i++) {
			console.log(`Updating sensor ${i}`);			 
			sensors[i].updateFillRatio(Math.random().toFixed(2), service);
			await sleep(5000);
		}
	}
}

const argv = process.argv.slice(2);
if(argv.length < 1) {
	console.log('Missing arguments');
	console.log('Usage: node start_sensor.js filename [service_name]');
	process.exit(-1);
}

var filename = argv[0];

var service = undefined;
if(argv.length == 2) {
	service = argv[1];
}
  
let rawdata = fs.readFileSync(filename);
let sensor_locations = JSON.parse(rawdata);
console.log(sensor_locations);
console.log(service);

try {
	var sensors = startSensors(sensor_locations, service);
} catch (error) {
	console.log('Error starting trash sensors');
	process.exit(-1);
}
sensors.then(sensors => updateSensors(sensors, service)).catch( error => process.exit(-1));

