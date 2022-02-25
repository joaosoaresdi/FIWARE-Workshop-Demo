#!/bin/bash

node trash_app/trash_app_logic.js trash_service 1027 &

node air_quality_app/air_quality_app_logic.js air_quality_service 1028 &

node parking_app/parking_app_logic.js parking_service 1029 &

node federated_app/federated_app_logic.js 1030 &

