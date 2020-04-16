#!/bin/bash

echo ""
echo "bestattunglechner"
echo "-----------------"

p=${1:-10}
# https://bestattunglechner.at/sterbefaelle?page=1
d=`dirname $0`/../scrape/scrape_bestattunglechner_$(date +%Y%m%d_%H%M%S)
mkdir $d
for ((i=1;i<=p;i++)); do
   curl "https://bestattunglechner.at/sterbefaelle?page=$i" > $d/$i.html
done
