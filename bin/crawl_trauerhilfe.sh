#!/bin/bash
echo ${pwd}
p=${1:-10}
d=`dirname $0`/../scrape/scrape_trauerhilfe_$(date +%Y%m%d_%H%M%S)
mkdir -p $d
for ((i=0;i<p;i++)); do
   curl "https://www.trauerhilfe.at/todesanzeigen/region/tirol//?tx_wcdeceased_pi1%5Bpage%5D=$i" > $d/$i.html
done
