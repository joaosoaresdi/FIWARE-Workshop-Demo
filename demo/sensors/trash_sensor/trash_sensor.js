var broker = require('../../lib/broker_connection.js');

class TrashSensor {
	constructor(sensor_id, sensor_type, lat, long, fill_ratio){
		this.sensor_id = sensor_id;
		this.sensor_type = sensor_type;
		this.lat = lat;
		this.long = long;
		this.fill_ratio = fill_ratio;
	}
	
	#create_register_request() {
		return {id: this.sensor_id, type: this.sensor_type, location:{value:`${this.lat},${this.long}`, type : 'geo:point'}, ratio:{value: this.fill_ratio, type: 'Float'}};
	}

	async registerSensor(service) {
		console.log(`Registering trash sensor: ${this.sensor_id}, with coords (${this.lat}, ${this.long})`);
		var data = JSON.stringify(this.#create_register_request());
		console.log(data);
		try {
			await broker.registerContext(this.sensor_id, this.sensor_type, data, service);
		} catch (error) {
			throw error;
		}
	}

	#create_update_request() {
		return {ratio:{value: this.fill_ratio, type: 'Float'}};
	}
	
	async updateFillRatio(fill_ratio,service) {
		try {
			this.fill_ratio = fill_ratio;
			var data = JSON.stringify(this.#create_update_request());
			await broker.updateContext(this.sensor_id, data, service);
		} catch (error) {
			throw error;
		}
	}
}

module.exports = {
    TrashSensor: TrashSensor
}
