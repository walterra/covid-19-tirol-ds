#!/bin/bash

echo ""
echo "kroell"
echo "------"

d=`dirname $0`/../scrape/scrape_kroell_$(date +%Y%m%d_%H%M%S)
mkdir $d
host="https://www.bestattung-kroell.at"

curl "$host/de/sterbefaelle/sterbefaelle.html" > $d/_a.html
echo "$host done"
