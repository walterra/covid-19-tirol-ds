#!/bin/bash

echo ""
echo "mueller"
echo "-------"

currentdate=$(date +%Y%m%d_%H%M%S)
p=${1:-10}
# https://www.bestattung-mueller.at/sterbefaelle/page/1
d=`dirname $0`/../scrape/scrape_mueller_$currentdate
mkdir $d
for ((i=1;i<=p;i++)); do
   curl "https://www.bestattung-mueller.at/sterbefaelle/page/$i" > $d/$i.html
done

dl=`dirname $0`/../scrape/scrape_mueller_parten
mkdir $dl

nodedir=`dirname $0`/../src/parse_mueller_links
node $nodedir scrape_mueller_$currentdate
