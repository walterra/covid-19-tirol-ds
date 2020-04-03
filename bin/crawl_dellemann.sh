#!/bin/bash
p=${1:-10}
d=`dirname $0`/../scrape/scrape_dellemann_$(date +%Y%m%d_%H%M%S)
mkdir $d

curl "https://www.bestattung-dellemann.at/sterbefaelle/wir-trauern-um.html" > $d/_a.html
curl "https://www.bestattung-dellemann.at/sterbefaelle/archivierte-sterbefaelle.html" > $d/1.html

for ((i=0;i<p;i++)); do
   curl "http://kuratorium-bestattung.at/sterbefaelle/page/$i" > $d/$i.html
done
