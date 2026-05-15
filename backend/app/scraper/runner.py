from scrapy.crawler import CrawlerProcess

from app.scraper import settings as scraper_settings
from app.scraper.spiders.internships_spider import InternshipsSpider
from app.scraper.spiders.jobs_spider import JobsSpider
from app.scraper.spiders.news_spider import NewsSpider
from app.scraper.spiders.tenders_spider import TendersSpider


def _scrapy_settings_dict() -> dict:
    return {
        key: value
        for key, value in vars(scraper_settings).items()
        if key.isupper()
    }


def run_all() -> None:
    process = CrawlerProcess(_scrapy_settings_dict())
    process.crawl(NewsSpider)
    process.crawl(JobsSpider)
    process.crawl(TendersSpider)
    process.crawl(InternshipsSpider)
    process.start()


if __name__ == "__main__":
    run_all()
