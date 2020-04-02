# WORK IN PROGRESS

This is the source code of an ongoing investigation of obituary notices in Tirol, Austria.

I'm making the source code available for transparency and reproducability. If you plan to use this yourself, please make sure you read and understand the [LICENSE](LICENSE). This is a [Citizen Science](https://en.wikipedia.org/wiki/Citizen_science) project. Consider this as highly experimental prototype code.

The aim of this project is to collect, clean and represent this data in a way so it's useful for data journalists and researchers so we have another data vector to investigate and learn more about the COVID19 pandemic.

## Crawling

This is about scraping the raw HTML of web pages hosting obituary notices.

On each run, the crawlers will create a directory in the form of `scrape_<crawler_name>_YYYYMMDD_HHMMSS` and save each HTML page in files named `[1|2|...].html`. The crawlers default to scrape `10` pages, this can be customized using a command line parameter:

```bash
./crawl_trauerhilfe.sh 500
./crawl_kuratorium_bestattung.sh 800
```

## Parsing

The aim of the parsing step is to transform the scraped HTML into consumable CSV data.

`documentation upcoming`

## Results

The final result of the processed data can be found here:

[data/tirol_obituaries_deduped.csv](data/tirol_obituaries_deduped.csv)

Charts and further analysis:

[walterra.github.io/covid-19-tirol-ds](https://walterra.github.io/covid-19-tirol-ds)
