#!/bin/bash
set -e
mkdir -p /data/mapd-data-00
initdb --data /data/mapd-data-00
mapd_server --http-port 9090 -p 9091 --data /data/mapd-data-00 &
sleep 5
mapdql -p HyperInteractive < /data/create.sql
