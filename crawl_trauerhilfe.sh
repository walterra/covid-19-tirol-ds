#!/bin/bash
p=${1:-10}
d="scrape_trauerhilfe_$(date +%Y%m%d_%H%M%S)"
eval "mkdir $d"
for ((i=0;i<p;i++)); do
   eval "curl https://www.trauerhilfe.at/todesanzeigen/region/tirol/\?tx_wcdeceased_pi1%5Bpage%5D\=$i > $d/$i.html"
done
