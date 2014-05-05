#!/bin/sh

while /bin/true; do

echo "starting..."
node --max-stack-size=4G start boothost=dev-monitor1:7070 
echo "sleeping..."
sleep 1

done >> boot.log 2>&1
