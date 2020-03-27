#!/bin/bash
p=${1:-10}
d="scrape_kuratorium_bestattung_$(date +%Y%m%d_%H%M%S)"
eval "mkdir $d"
for ((i=0;i<p;i++)); do
   eval "curl http://kuratorium-bestattung.at/sterbefaelle/page/$i > $d/$i.html"
done
