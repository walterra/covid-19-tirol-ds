#!/bin/bash
p=${1:-10}
# https://www.derbestatter.at/sterbefaelle/page/1
d=`dirname $0`/../scrape/scrape_derbestatter_$(date +%Y%m%d_%H%M%S)
mkdir $d
for ((i=1;i<=p;i++)); do
   curl "https://www.derbestatter.at/sterbefaelle/page/$i" > $d/$i.html
done
