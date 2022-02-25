var fs = require('fs');
const readline = require('readline');
let sensor = require('./airquality_sensor.js');

let AirqualitySensor = sensor.AirqualitySensor;

async function sleep(millis) {
	return new Promise(resolve => setTimeout(resolve, millis));
}

let sensors = [];

async function startSensors(sensor_data, service, broker_port) {
	for (var i = 0; i < sensor_data.length; i++) {
		console.log(sensor_data[i]);
		var temperature = Math.floor(Math.random()*40);
		var humidity = Math.random()*100;
		var pressure = 900 + Math.floor(Math.random()*200);
		var co2 = Math.floor(Math.random()*10000);
		var s = new AirqualitySensor(`airquality_sensor_${i}`, 'airquality_sensor', sensor_data[i].lat, sensor_data[i].long, temperature, humidity, pressure, co2);
		console.log(s);
		sensors.push(s);
		try {
			var ret = await s.registerSensor(service, broker_port); 
			console.log(ret);
		} catch (error) {
			console.log(error);
			process.exit(-1);
		}
	}
	return sensors;
}

async function updateSensors(service, broker_port) {
	while(true) {
		for(var i = 0; i < sensors.length; i++) {
			console.log(`Updating sensor ${i}: ${sensors[i].sensor_id}`);		
			var temperature = Math.floor(Math.random()*40);
			var humidity = (Math.random()*100).toFixed(2);
			var pressure = 900+Math.floor(Math.random()*200);
			var co2 = Math.floor(Math.random()*10000);
			sensors[i].updateSensor(temperature, humidity, pressure, co2, service, broker_port);
			await sleep(5000);
		}
	}
}

const argv = process.argv.slice(2);

if(argv.length < 1) {
	console.log('Missing arguments');
	console.log('Usage: node start_airquality_sensor.js filename service_name broker_port');
	process.exit(-1);
}

var filename = argv[0];
var service = argv[1];
var broker_port = argv[2];

var rawdata = fs.readFileSync(filename);
var sensor_data = JSON.parse(rawdata);

console.log(sensor_data);
console.log(service);


var x = startSensors(sensor_data, service, broker_port);
console.log(x);
x.then(updateSensors(service, broker_port));


