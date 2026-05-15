import scrapy


class SourceItem(scrapy.Item):
    item_type = scrapy.Field()
    title = scrapy.Field()
    source_name = scrapy.Field()
    source_url = scrapy.Field()
    region = scrapy.Field()
    organization = scrapy.Field()
    content = scrapy.Field()
    published_at = scrapy.Field()
    closing_date = scrapy.Field()
    amount_text = scrapy.Field()
