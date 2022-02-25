var fs = require('fs');
const readline = require('readline');
let sensor = require('./parking_sensor.js');

let ParkingSensor = sensor.ParkingSensor;

async function sleep(millis) {
	return new Promise(resolve => setTimeout(resolve, millis));
}

let sensors = [];

async function startSensors(sensor_data, service, broker_port) {
	
	for (var i = 0; i < sensor_data.length; i++) {
		console.log(sensor_data[i]);
		var ocupancy = Math.floor(Math.random()*parseInt(sensor_data[i].capacity));
		var s = new ParkingSensor(`parking_sensor_${i}`, 'parking_sensor', sensor_data[i].lat, sensor_data[i].long, parseInt(sensor_data[i].capacity), ocupancy);
		console.log(s);
		sensors.push(s);	
		await s.registerSensor(service, broker_port);
	}
	return sensors;
}

async function updateSensors(service, broker_port) {
	while(true) {
		for(var i = 0; i < sensors.length; i++) {
			console.log(`Updating sensor ${i}: ${sensors[i].sensor_id}`);		
			var amount = Math.floor(Math.random()*sensors[i].capacity);
			if (Math.random() > 0.5) { // enter cars
				var new_ocupancy = sensors[i].ocupancy + amount;
				new_ocupancy = new_ocupancy > sensors[i].capacity ? sensors[i].capacity : new_ocupancy;
				sensors[i].updateOcupancy(new_ocupancy, service, broker_port);
			} else { //exit cars
				var new_ocupancy = sensors[i].ocupancy - amount;
				new_ocupancy = new_ocupancy < 0 ? 0 : new_ocupancy;
				sensors[i].updateOcupancy(new_ocupancy, service, broker_port);
			}
			await sleep(5000);
		}
	}
}

const argv = process.argv.slice(2);
if(argv.length < 3) {
	console.log('Missing arguments');
	console.log('Usage: node start_parking_sensor.js filename service_name broker_port');
	process.exit(-1);
}

var filename = argv[0];
var service = argv[1];
var broker_port = argv[2];
  
let rawdata = fs.readFileSync(filename);
let sensor_data = JSON.parse(rawdata);
console.log(sensor_data);
console.log(service);

var x = startSensors(sensor_data, service, broker_port);
console.log(x);
x.then(updateSensors(service, broker_port));


