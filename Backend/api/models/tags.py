from django.db import models

from .base import BaseModel


class TagManager(models.Manager):

    def get_by_id(self, tag_id):
        return self.filter(id=tag_id).first()

    def get_by_title(self, title):
        return self.filter(title=title).first()

    def filter_by_blog(self, blog):
        return self.filter(blog=blog)


class Tag(BaseModel):
    title = models.TextField(null=False, default='')

    objects = TagManager()

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'created_on': self.created_on,
            'updated_on': self.updated_on,
        }

    @classmethod
    def create(cls, title):
        tag = Tag(
            title=title
        )

        tag.save()
        return tag
