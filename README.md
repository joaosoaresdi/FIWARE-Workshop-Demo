# SafeCities - WP5 FIWARE workshop 

This project contains the source code for the smart-city apps created for the FIWARE workshop.

## Applications
The apps focus on 3 use cases for smart-cities: waste management, parking management, and air quality monitoring.
Each application display sensor information over a city map, updating its contents everytime a sensor updates the corresponding context Broker.

Each application simulates 3 sensor types: trash sensors; parking sensors; and, air quality sensors).
The trash sensors are used in a smart-city waste management application that displays the usage level of a set of waste bins over a city map.
The parking sensor is similar but focuses on car park management, displaying park dimensions and occupancy level.  
The parking sensor is similar but focuses on car park management, displaying park dimensions and occupancy level.  

Sensors start by registering their respective contexts with the Context Broker, and periodically update their information (every 5 seconds). 
Each application starts by subscribing to the respective sensor type(s) with the Context Broker, updating its corresponding state with every Broker notification.
Clients (i.e., browsers) register a ServerSide Event handler for receiving application updates.

## Configurations
We demonstrate 3 diferent configuration models: single-tenant; multi-tenant; and, federated.

### Single-tenant Demo
In the single-tenant demo, all sensors and applications share the same Context Broker and the same Fiware-Service.

### Multi-tenant Demo
In the multi-tenant demo, each sensor type and application are associated with its own Fiware-Service.

### Federated Demo 
In the federation example, each sensor type and respective application have a dedicated Context Broker.
A 4th Context Broker is used to received push notification from the other brokers, and integrated the respetive data on a single application.


## Running the Demos
In each demo directory (demo and federated_demo), a docker-compose.yml file contains the Context Broker service(s) and network configurations.

Start it using:
 - docker-compose up 

### Single and Multi-Tenant configurations
The 'apps' directory contains the Web Applications (app server and http server), that serve each app.

Start it using:
 - node app_logic.js [multi-tenant = false]
 The multi-tenant option is false by default, and allows to demo de multi-tenant configuration.
 
The 'sensor' directory contains the sensor simulation. Each of its sub-directories, representing the respective sensor type, contains the sensor simulation code as well as a .json file that contains the geographic location of esch sensor (coordinates).
Two scripts are available for instantiating the sensors:
 - start_sensors_single_tenant.sh -> starts the sensors in a single-tenant configuration;
 - start_sensors_multi_tenant.sh -> starts the sensors in a multi-tenant configuration;
 
The web app is configured to run on port 3000 -> 'http://localhost:3000'

### Federated configurations

The sensors can be started using the 'start_sensors.sh' script, available in the 'sensors' directory.

The Application and Web servers can be started using the 'start_apps.sh' script, available in the 'apps' directory.
In this example the Trash App runs on port 3001, the Air Quality App on port 3002, and the Parking App on port 3003.
The aggregation app (subscribing broker) runs on port 3004.

To enable the federation the start_federation.js script is provided. This creates the subscriptions from the aggregation Broker to the other service brokers.
  
Run it using:
 - node start_federation.js
 

## Requirements
This example requires nodeJS version 12 or higher, since private methods are used in the sensor modelling files.
