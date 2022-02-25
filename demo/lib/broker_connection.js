var http = require('http');
var config = require('../config/config.js');

/**
 *  Creates request headers: Content-Type, Content-Length, and Fiware-Service if service is defined
 */
function create_headers(data, service) {
	if(service !== undefined) {
		return {'Content-Type': 'application/json', 'Fiware-Service': service, 'Content-Length': data.length};
	}
	else {
		return {'Content-Type': 'application/json', 'Content-Length': data.length};
	}
}

/**
 *  returns HTTP options for registering a new context
 */
function create_register_context_options(data, service, broker_port) {
	return {
		host: config.broker_host,
		port: broker_port,
		path: '/v2/entities',
		method: 'POST',
		headers: create_headers(data, service)
	};
}

/**
 *  returns HTTP options for querying a context
 */
function create_context_query_options(id, type, service, broker_port) {
	var headr = {'Accept': 'application/json'};
	if(service !== undefined) {
		headr = {'Accept': 'application/json', 'Fiware-Service': service}
	}
	return {
	  host: config.broker_host,
	  port: broker_port,
	  path: `/v2/entities/${id}?type=${type}`,
	  method: 'GET',
	  headers: headr
	};
}

/**
 *  returns HTTP options for updating a context
 */
function create_context_update_options(sensor_id, data, service, broker_port) {
	return {
	  host: config.broker_host,
	  port: broker_port,
	  path: `/v2/entities/${sensor_id}/attrs` ,
	  method: 'PATCH',
		headers: create_headers(data, service)
	};
}

/**
 *  returns HTTP options for subscribing to a context broker
 */
function create_broker_subscription_options(data, service, broker_port) {
	return {
	  host: config.broker_host,
	  port: broker_port,
	  path: '/v2/subscriptions/' ,
	  method: 'POST',
		headers: create_headers(data, service)
	};
}

/**
 *  Subscribes to a context broker - synchronous
 * 	returns subscriptionId or throws error
 */
async function subscribeBroker(data, service, broker_port) {
	var headers = create_broker_subscription_options(data, service, broker_port);

	console.log('-------------------- Subscribe Broker ------------------------');
	console.log(headers);
	console.log(data);
	console.log('');
	console.log('--------------------------------------------------------------');

	const res = new Promise((resolve, reject) => {
		req = http.request(headers, resp => {
			console.error(`\t Response: ${resp.statusCode} - ${resp.statusMessage}`);	  
			resp.on('data', data => {
				console.log(`\t Message: ${data}`);
			});
			
			resolve(resp.headers.location);
		})
	
		req.on('error', error => {
			console.error(`\t Error: ${error}`);
			reject(error);
		});

		req.write(data);
	
		req.end();
	});
	return res.then(location => {return location;}).catch(err => {throw err;})
}


/**
 *  Sends a context update to the context broker - synchronous
 * 	returns true or throws error
 */
function updateContext(sensor_id, data, service, broker_port) {
	var headers = create_update_headers(sensor_id, data, service, broker_port);
	
	console.log('---------------------- Update Context ----------------------');
	console.log(headers);
	console.log(data);
	console.log('');
	console.log('------------------------------------------------------------');

	const res = new Promise((resolve, reject) => {
		const req = http.request(headers, resp => {
			console.log(`\t Response: ${resp.statusCode} - ${resp.statusMessage}`);
			resp.on('data', data => {
				console.log(`\t Message: ${data}`);
			});
			resolve(true);
		});

		req.on('error', error => {
			console.error(`\t Error: ${error}`);
			reject(error);
		});

		req.write(data);
		req.end();
		
	});
	return res.then(ret => {return ret;}).catch(err => {throw err;})
}

/**
 *  Sends a context query to the context broker - synchronous
 * 	returns true if context exists, false if not registered or throws error
 */
async function queryContext(sensor_id, sensor_type, data, service, broker_port) {
	var headers = create_context_query_options(sensor_id, sensor_type, service, broker_port);
	const res = new Promise((resolve, reject) => {
		var req = http.request(headers, resp => { // querying broker to know if Context already registered
			if(resp.statusCode == 200) { // context already registered
				//console.log('\t context already registered');
				resolve(true);
			}
			else { // context not registered
				//console.log('\t context not registered');
				resolve(false);
			}
		});
	
		req.on('error', error => { // error connecting to broker
			//console.log('\t Error connecting to Broker');
			reject(error);
		});
		req.end();
	});
	return res.then(exists => {return exists;});
}

/**
 *  Registers a context with the context broker - synchronous
 * 	returns true if successfully, false if context exists or throws error
 */
async function registerContext(sensor_id, sensor_type, data, service, broker_port) {
	let registered;
	try {
		registered = await queryContext(sensor_id, sensor_type, data, service, broker_port);
	} catch (error) {
		throw error;
	}

	if( !registered ) {
		headers = create_register_context_options(data, service, broker_port);
		//console.log('\t Registering Context... ');
		const res = new Promise((resolve, reject) => {
			var req = http.request(headers, resp => {  //registering Context in Broker
				if(resp.statusCode == 201) { // context registered successfully
					console.log('\t Context registered successfully!');
					resolve(true);
				}
				else { // fail to registered context
					console.log(`\t Error registering Context: ${resp.statusCode} - ${resp.statusMessage}`);
					resolve(false);				
				}
				resp.on('data', data => {
					//console.log(`\t Registering Context: ${data}`);
				});
			});
			
			req.on('error', error => {
				console.error(`\t Error querying Broker for registering Contex: ${error}`);
				reject(error);
			});
			
			req.write(data); // send Context register JSON 
			req.end();
		});
		return res.then(exists => {return exists;});
	}
	else {
		console.log('\t Context already registered!');
		return true;
	}
}

module.exports.registerContext = registerContext;
module.exports.updateContext = updateContext;
module.exports.subscribeBroker = subscribeBroker;
