#!/bin/bash
chmod 777 /docker-entrypoint-initdb.d/init.sql
exec docker-entrypoint.sh postgres