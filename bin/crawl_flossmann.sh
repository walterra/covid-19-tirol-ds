#!/bin/bash

echo ""
echo "flossmann"
echo "---------"

p=${1:-10}
# https://bestattung-flossmann.at/sterbefaelle?p=1
d=`dirname $0`/../scrape/scrape_flossmann_$(date +%Y%m%d_%H%M%S)
mkdir $d
for ((i=1;i<=p;i++)); do
   curl "https://bestattung-flossmann.at/sterbefaelle?p=$i" > $d/$i.html
done
