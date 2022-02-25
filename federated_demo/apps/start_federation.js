var broker = require('../lib/broker_connection.js');

function create_subscription(app, sensor_type, attr_set) {
	return {
		description: `Federation subscription to ${sensor_type} sensors on ${attr_set}`,
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
				url: `http://host.docker.internal:1030/v2/op/notify`
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
		console.log("Successfully subscribed to Broker:");
		console.log(subs);
	}
}

var service = "trash_service";
var broker_port = 1027;
var trash_subscription = create_subscription('trash', 'trash_sensor', ['location', 'ratio']); 
console.log(JSON.stringify(trash_subscription));
console.log(service);
subscribeBroker(trash_subscription, service, broker_port);

service = "air_quality_service";
broker_port = 1028;
var parking_subscription = create_subscription('airquality', 'airquality_sensor', ['location', 'temperature', 'humidity', 'pressure', 'co2']); 
console.log(JSON.stringify(parking_subscription));
console.log(service);
subscribeBroker(parking_subscription, service, broker_port);

service = "parking_service";
broker_port = 1029;
var parking_subscription = create_subscription('parking', 'parking_sensor', ['location', 'capacity', 'ocupancy']); 
console.log(JSON.stringify(parking_subscription));
console.log(service);
subscribeBroker(parking_subscription, service, broker_port);
