var broker = require('../../lib/broker_connection.js');
var fs = require('fs');
const readline = require('readline');


async function sleep(millis) {
	return new Promise(resolve => setTimeout(resolve, millis));
}

function create_register_request(sensor_id, sensor_type, data) {
	return {id: sensor_id, type: sensor_type, message:{value: data, type: 'String'}};
}

async function registerContext(sensor_id, sensor_type) {
	var data = JSON.stringify(create_register_request(sensor_id, sensor_type, 'Context Registration'));
	broker.registerContext(sensor_id, sensor_type, data)
}

function create_update_request(sensor_id, sensor_type, data) {
	return {message:{value: data, type: 'String'}};
}

async function processLineByLine(sensor_id, sensor_type, filename) {
  const fileStream = fs.createReadStream(filename);

  fileStream.on('error', function(error) {
		console.log(`Unknown filename: ${argv[0]}`);
		process.exit(-1);
  });

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
		var message = `${sensor_id}: ${line}`;
    var data = JSON.stringify(create_update_request(sensor_id, sensor_type, message));
		broker.updateContext(sensor_id, data);

    await sleep(1000);
  }
}

const argv = process.argv.slice(2);
if(argv.length < 2) {
	console.log('Missing arguments');
	console.log('Usage: node message_sensor.js sensor_id [sensor_type] filename');
	process.exit(-1);
}

var sensor_id = argv[0];
var file_index = argv.length-1; 
var sensor_type = file_index > 1 ? argv[1]: 'message_sensor';
var filename = argv[file_index];

console.log(`Starting message sensor: ${sensor_id}, with file ${filename}`);

registerContext(sensor_id, sensor_type);

processLineByLine(sensor_id, sensor_type, filename);


