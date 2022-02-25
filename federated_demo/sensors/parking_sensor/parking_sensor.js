var broker = require('../../lib/broker_connection.js');

class ParkingSensor {
	constructor(sensor_id, sensor_type, lat, long, capacity, ocupancy){
		this.sensor_id = sensor_id;
		this.sensor_type = sensor_type;
		this.lat = lat;
		this.long = long;
		this.capacity = capacity;
		this.ocupancy = ocupancy;
	}
	
	#create_register_request() {
		return {id: this.sensor_id, type: this.sensor_type, location:{value:`${this.lat},${this.long}`, type : 'geo:point'}, capacity:{value: this.capacity, type: 'Number'}, ocupancy:{value: this.ocupancy, type: 'Number'}};
	}

	async registerSensor(service, broker_port) {
		console.log(`Registering trash sensor: ${this.sensor_id}, with coords (${this.lat}, ${this.long})`);
		var data = JSON.stringify(this.#create_register_request());
		console.log(data);
		await broker.registerContext(this.sensor_id, this.sensor_type, data, service, broker_port)
	}

	#create_update_request() {
		return {ocupancy:{value: this.ocupancy, type: 'Number'}};
	}
	
	async updateOcupancy(ocupancy, service, broker_port) {
		this.ocupancy = ocupancy;
		var data = JSON.stringify(this.#create_update_request());
		await broker.updateContext(this.sensor_id, data, service, broker_port);
	}
}

module.exports = {
    ParkingSensor: ParkingSensor
}

