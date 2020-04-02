#!/bin/bash
node ./src/parse_trauerhilfe scrape_trauerhilfe_20200327_174811
node ./src/parse_kuratorium_bestattung scrape_kuratorium_bestattung_20200327_180153
node ./src/parse_dellemann scrape_dellemann
node ./src/parse_kroell scrape_kroell
node ./src/parse_deduplicate
