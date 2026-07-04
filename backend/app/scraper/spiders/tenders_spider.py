import scrapy

from app.scraper.items import SourceItem
from app.scraper.quality import is_noise_url, is_quality_content, same_domain


class TendersSpider(scrapy.Spider):
    name = "tenders_spider"
    allowed_domains = ("biddetail.com", "namibian.com.na", "neweralive.na")
    start_urls = [
        "http://biddetail.com/namibia-tenders",
        "https://neweralive.na/category/business/",
    ]

    def parse(self, response):
        for a in response.css("a::attr(href)").getall()[:120]:
            if a and a.startswith("http") and same_domain(a, self.allowed_domains) and not is_noise_url(a):
                yield response.follow(a, callback=self.parse_tender)

    def parse_tender(self, response):
        title = response.css("title::text").get()
        if not title:
            return
        content = " ".join(response.css("p::text").getall()[:20]).strip()
        t = f"{title} {content}".lower()
        if not any(k in t for k in ("tender", "bid", "rfq", "procurement", "quotation")):
            return
        if not is_quality_content(title, content):
            return
        yield SourceItem(
            item_type="tender",
            title=title.strip()[:500],
            source_name=response.url.split("/")[2],
            source_url=response.url,
            region="Namibia",
            organization=None,
            content=content,
            published_at=None,
            closing_date=None,
            amount_text=None,
        )
