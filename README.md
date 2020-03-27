# WORK IN PROGRESS

This is the source code of an ongoing investigation of obituary notices in Tirol, Austria.

I'm making the source code available for transparency and reproducability. If you plan to use this yourself, please make sure you read and understand the [LICENSE](LICENSE).

## Crawling

This is about scraping the raw HTML of web pages hosting obituary notices.

On each run, the crawlers will create a directory in the form of `scrape_<crawler_name>_YYYYMMDD_HHMMSS` and save each HTML page in files named `[1|2|...].html`. The crawlers default to scrape `10` pages, this can be customized using a command line parameter:

```bash
./crawl_trauerhilfe.sh 500
./crawl_kuratorium_bestattung.sh 800
```
