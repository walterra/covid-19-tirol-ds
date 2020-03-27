# WORK IN PROGRESS

This is the source code of an ongoing investigation of obituary notices in Tirol, Austria.

## Crawling

This is about scraping the raw HTML of web pages hosting obituary notices.

On each run, the crawlers will create a directory in the form of `scrape_<crawler_name>_YYYYMMDD_HHMMSS` and save each HTML page in files named `[1|2|...].html`.

```bash
./crawl_trauerhilfe.sh 500
./crawl_kuratorium_bestattung.sh 800
```

----

[LICENSE](LICENSE)
