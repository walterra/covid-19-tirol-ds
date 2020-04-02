# Tirol, Austria — Obituary Notices

This is the source code of an ongoing investigation of obituary notices in Tirol, Austria.

I'm making the source code available for transparency and reproducability. If you plan to use this yourself, please make sure you read and understand the [LICENSE](LICENSE). This is a [Citizen Science](https://en.wikipedia.org/wiki/Citizen_science) project. Consider this as highly experimental prototype code.

The aim of this project is to collect, clean and represent this data in a way so it's useful for data journalists and researchers so we have another data vector to investigate and learn more about the COVID19 pandemic.

## tl;dr

Charts and Analysis Results:
[walterra.github.io/covid-19-tirol-ds](https://walterra.github.io/covid-19-tirol-ds)


## Crawling

This is about scraping the raw HTML of web pages hosting obituary notices.

On each run, the crawlers will create a directory in the form of `scrape/scrape_<crawler_name>_YYYYMMDD_HHMMSS` and save each HTML page in files named `[1|2|...].html`. The crawlers default to scrape `10` pages, this can be customized using a command line parameter:

```bash
./bin/crawl_trauerhilfe.sh 500
./bin/crawl_kuratorium_bestattung.sh 800

#  note this one doesn't work yet because of a unique hash in the URL.
# ./bin/crawl_dellemann.sh

#  this one wasn't necessary so far because it's just a single page.
# ./bin/crawl_kroell.sh
```

## Parsing

The aim of the parsing step is to transform the scraped HTML into consumable CSV data.

```bash
./bin/parse.sh
```

This file runs several sub-scripts to parse the different formats retrieved during the crawling step and transforms them to the same format of `date,municipaly,district,hash`. The names are cheaply hashed to available for comparison in the final deduplication step.

Note the crawlers will create directory names dynamically including the current dates. To parse them, you'll have to add the correct directory names as arguments for the individual scripts in `./bin/parse.sh`.

The same needs to be done for the deduplication script `./src/parse_deduplicate.js`. In this file you'll need to adapt the filenames of the individual parse CSV files and the desired output filename.

## Results

The final result of the processed data can be found here:

[data/tirol_obituaries_deduped.csv](data/tirol_obituaries_deduped.csv)

Charts and further analysis:

[walterra.github.io/covid-19-tirol-ds](https://walterra.github.io/covid-19-tirol-ds)
