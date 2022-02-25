#!/bin/bash
  
echo "Starting Trash Sensores"
node trash_sensor/start_trash_sensors.js trash_sensor/sensor_location.json trash_service &> /dev/null &
sleep 1

echo "Starting Parking Sensores"
node parking_sensor/start_parking_sensors.js parking_sensor/sensor_location.json parking_service &> /dev/null &
sleep 1

echo "Starting Air Quality Sensores"
node airquality_sensor/start_airquality_sensors.js airquality_sensor/sensor_location.json air_quality_service &> /dev/null &

echo "Done"

