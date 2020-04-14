#!/bin/bash

echo ""
echo "derbestatterarchiv"
echo "------------------"

p=${1:-10}
# https://p453611.mittwaldserver.info/todesanzeigen?page=1
d=`dirname $0`/../scrape/scrape_derbestatterarchiv_$(date +%Y%m%d_%H%M%S)
mkdir $d
for ((i=1;i<=p;i++)); do
   curl "https://p453611.mittwaldserver.info/todesanzeigen?page=$i" > $d/$i.html
done
