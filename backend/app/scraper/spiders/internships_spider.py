import scrapy

from app.scraper.items import SourceItem
from app.scraper.quality import is_noise_url, is_quality_content, same_domain


class InternshipsSpider(scrapy.Spider):
    name = "internships_spider"
    allowed_domains = ("myjobmag.co.na", "namibian.com.na", "neweralive.na")
    start_urls = [
        "https://www.myjobmag.co.na/jobs-by-title/intern",
        "https://www.namibian.com.na/category/business/job-finder/",
    ]

    def parse(self, response):
        for a in response.css("a::attr(href)").getall()[:120]:
            if a and a.startswith("http") and same_domain(a, self.allowed_domains) and not is_noise_url(a):
                yield response.follow(a, callback=self.parse_internship)

    def parse_internship(self, response):
        title = response.css("title::text").get()
        if not title or "intern" not in title.lower():
            return
        content = " ".join(response.css("p::text").getall()[:20]).strip()
        if not is_quality_content(title, content):
            return
        yield SourceItem(
            item_type="internship",
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
