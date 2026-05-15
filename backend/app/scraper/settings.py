BOT_NAME = "namibiatimes_scraper"

SPIDER_MODULES = ["app.scraper.spiders"]
NEWSPIDER_MODULE = "app.scraper.spiders"

ROBOTSTXT_OBEY = True
DOWNLOAD_DELAY = 1.0
CONCURRENT_REQUESTS = 8

ITEM_PIPELINES = {
    "app.scraper.pipelines.BackendPushPipeline": 300,
}
