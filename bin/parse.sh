#!/bin/bash
dir=`dirname $0`

cd $dir/../scrape
trauerhilfe=`ls -d1 */ | grep trauerhilfe | sed "s/\///"`
kuratorium=`ls -d1 */ | grep kuratorium | sed "s/\///"`
dellemann=`ls -d1 */ | grep dellemann | sed "s/\///"`
kroell=`ls -d1 */ | grep kroell | sed "s/\///"`
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

echo "running deduplication"
node ./src/parse_deduplicate
cd -
