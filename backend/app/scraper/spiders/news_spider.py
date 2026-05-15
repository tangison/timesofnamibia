import scrapy

from app.scraper.items import SourceItem
from app.scraper.quality import is_noise_url, is_quality_content, same_domain


class NewsSpider(scrapy.Spider):
    name = "news_spider"
    allowed_domains = ("namibian.com.na", "neweralive.na")
    start_urls = [
        "https://www.namibian.com.na/",
        "https://neweralive.na/",
    ]

    def parse(self, response):
        for a in response.css("a::attr(href)").getall()[:120]:
            if a and a.startswith("http") and same_domain(a, self.allowed_domains) and not is_noise_url(a):
                yield response.follow(a, callback=self.parse_article)

    def parse_article(self, response):
        title = response.css("title::text").get()
        if not title:
            return
        paragraphs = " ".join(response.css("p::text").getall()[:20]).strip()
        if not is_quality_content(title, paragraphs):
            return
        yield SourceItem(
            item_type="news",
            title=title.strip()[:500],
            source_name=response.url.split("/")[2],
            source_url=response.url,
            region="Namibia",
            organization=None,
            content=paragraphs,
            published_at=None,
            closing_date=None,
            amount_text=None,
        )
