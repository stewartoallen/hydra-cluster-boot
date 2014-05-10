#!/bin/sh

host=${1:-$(hostname)}
port=${2:-8007}

while /bin/true; do

echo "starting..."
node --max-stack-size=4G start boothost=${host}:${port}
echo "sleeping..."
sleep 1

done >> boot.log 2>&1
