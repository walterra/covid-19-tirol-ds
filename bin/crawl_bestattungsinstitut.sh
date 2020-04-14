#!/bin/bash

echo ""
echo "bestattungsinstitut"
echo "-------------------"

p=${1:-10}
# https://www.bestattungsinstitut.at/index.php/gedenkportal-48.html?currP=1
d=`dirname $0`/../scrape/scrape_bestattungsinstitut_$(date +%Y%m%d_%H%M%S)
mkdir $d
for ((i=1;i<=p;i++)); do
   curl "https://www.bestattungsinstitut.at/index.php/gedenkportal-48.html?currP=$i" > $d/$i.html
done
