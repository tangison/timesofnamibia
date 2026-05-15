import scrapy

from app.scraper.items import SourceItem
from app.scraper.quality import is_noise_url, is_quality_content, same_domain


class JobsSpider(scrapy.Spider):
    name = "jobs_spider"
    allowed_domains = ("namjobs.org", "myjobmag.co.na")
    start_urls = [
        "https://www.myjobmag.co.na/jobs",
        "https://namjobs.org/index.php/job-seeker/newest-jobs",
    ]

    def parse(self, response):
        for a in response.css("a::attr(href)").getall()[:120]:
            if a and a.startswith("http") and same_domain(a, self.allowed_domains) and not is_noise_url(a):
                yield response.follow(a, callback=self.parse_job)

    def parse_job(self, response):
        title = response.css("title::text").get()
        if not title:
            return
        content = " ".join(response.css("p::text").getall()[:20]).strip()
        title_l = title.lower()
        if not any(k in title_l or k in content.lower() for k in ("job", "vacancy", "hiring", "position", "apply")):
            return
        if not is_quality_content(title, content):
            return
        yield SourceItem(
            item_type="job",
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
