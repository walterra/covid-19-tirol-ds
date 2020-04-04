#!/bin/bash
p=${1:-10}
d=`dirname $0`/../scrape/scrape_dellemann_$(date +%Y%m%d_%H%M%S)
mkdir $d
host="https://www.bestattung-dellemann.at"

curl "$host/sterbefaelle/wir-trauern-um.html" > $d/_a.html
echo "$host init"
curl "$host/sterbefaelle/archivierte-sterbefaelle.html" > $d/1.html

# parsers: small brain; regex: galaxy brain
next=`grep 'href="/sterbefaelle/archivierte-sterbefaelle.html?tx_parten_partenausgabe' $d/1.html | head -n 1 | sed 's/.*="\([^"]*\).*/\1/' | sed 's/amp;//g'`

id=2
while [ ! -z $next ]
do
echo "$host$next"
curl "$host$next" > $d/$id.html
next=`grep "href=\"/sterbefaelle/archivierte-sterbefaelle.html?tx_parten_partenausgabe%5B%40widget_0%5D%5BcurrentPage%5D=$(( id + 1 ))" $d/$id.html | head -n 1 | sed 's/.*="\([^"]*\).*/\1/' | sed 's/amp;//g'`

id=$(( id + 1 ))
# let's bee nice
sleep 1
done

