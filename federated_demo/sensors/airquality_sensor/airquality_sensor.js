var broker = require('../../lib/broker_connection.js');

class AirqualitySensor {
	constructor(sensor_id, sensor_type, lat, long, temperature, humidity, pressure, co2){
		this.sensor_id = sensor_id;
		this.sensor_type = sensor_type;
		this.lat = lat;
		this.long = long;
		this.temperature = temperature;
		this.humidity = humidity;
		this.pressure = pressure;
		this.co2 = co2;
	}
	
	#create_register_request() {
		return {id: this.sensor_id, type: this.sensor_type, location:{value:`${this.lat},${this.long}`, type : 'geo:point'}, temperature:{value: this.temperature, type: 'Number'}, humidity:{value: this.humidity, type: 'Float'}, pressure:{value: this.pressure, type: 'Float'}, co2:{value: this.co2, type: 'Float'}};
	}

	async registerSensor(service, broker_port) {
		console.log(`Registering air quality sensor: ${this.sensor_id}, with coords (${this.lat}, ${this.long}), service : ${service}`);
		var data = JSON.stringify(this.#create_register_request());
		console.log(data); 
		var ret = await broker.registerContext(this.sensor_id, this.sensor_type, data, service, broker_port);
		return ret;
	}

	#create_update_request() {
		return {temperature:{value: this.temperature, type: 'Number'}, humidity:{value: this.humidity, type: 'Float'}, pressure:{value: this.pressure, type: 'Float'}, co2:{value: this.co2, type: 'Float'}};
	}
	
	async updateSensor(temperature, humidity, pressure, co2, service, broker_port) {
		console.log(`Updating air quality sensor: ${this.sensor_id}, with coords (${this.lat}, ${this.long}), service : ${service}`);
		this.temperature = temperature;
		this.humidity = humidity;
		this.pressure = pressure;
		this.co2 = co2;
		var data = JSON.stringify(this.#create_update_request());
		var ret = await broker.updateContext(this.sensor_id, data, service, broker_port);
		return ret;
	}
}

module.exports = {
    AirqualitySensor: AirqualitySensor
}

