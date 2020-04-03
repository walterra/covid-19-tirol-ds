#!/bin/bash
p=${1:-10}
d=`dirname $0`/../scrape/scrape_kuratorium_bestattung_$(date +%Y%m%d_%H%M%S)
mkdir $d
for ((i=0;i<p;i++)); do
   curl "http://kuratorium-bestattung.at/sterbefaelle/page/$i" > $d/$i.html
done
