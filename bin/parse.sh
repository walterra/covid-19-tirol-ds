#!/bin/bash
dir=`dirname $0`

cd $dir/../scrape
trauerhilfe=`ls -d1 */ | grep trauerhilfe | sed "s/\///"`
kuratorium=`ls -d1 */ | grep kuratorium | sed "s/\///"`
dellemann=`ls -d1 */ | grep dellemann | sed "s/\///"`
kroell=`ls -d1 */ | grep kroell | sed "s/\///"`
bestattungsinstitut=`ls -d1 */ | grep bestattungsinstitut | sed "s/\///"`
flossmann=`ls -d1 */ | grep flossmann | sed "s/\///"`
derbestatter=`ls -d1 */ | grep derbestatter | sed "s/\///"`
derbestatterarchiv=`ls -d1 */ | grep derbestatterarchiv | sed "s/\///"`
mueller_parten=`ls -d1 */ | grep mueller_parten | sed "s/\///"`
bestattunglechner=`ls -d1 */ | grep bestattunglechner | sed "s/\///"`
cd -

cd $dir/..
echo "parsing trauerhilfe"
for s in $trauerhilfe
do
  node ./src/parse_trauerhilfe $s
done

echo "parsing kuratorium"

for s in $kuratorium
do
  node ./src/parse_kuratorium_bestattung $s
done

echo "parsing dellemann"
for s in $dellemann
do
  node ./src/parse_dellemann $s
done

echo "parsing kroell"
for s in $kroell
do
  node ./src/parse_kroell $s
done

echo "parsing flossmann"
for s in $flossmann
do
  node ./src/parse_flossmann $s
done

echo "parsing bestattungsinstitut"
for s in $bestattungsinstitut
do
  node ./src/parse_bestattungsinstitut $s
done

echo "parsing derbestatter"
for s in $derbestatter
do
  node ./src/parse_derbestatter $s
done

echo "parsing derbestatterarchiv"
for s in $derbestatterarchiv
do
  node ./src/parse_derbestatterarchiv $s
done

echo "parsing mueller_parten"
for s in $mueller_parten
do
  node ./src/parse_mueller $s
done

echo "parsing bestattunglechner"
for s in $bestattunglechner
do
  node ./src/parse_bestattunglechner $s
done

echo "running deduplication"
node ./src/parse_deduplicate
cd -
