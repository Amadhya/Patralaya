from django.db import models
from .users import User

from .base import BaseModel


class BlogManager(models.Manager):
    def get_by_user_id(self, user):
        return self.filter(user=user)

    def get_by_id(self, blog_id):
        return self.filter(id=blog_id).first()

    def filter_by_category(self, filter_blog):
        return self.filter(category=filter_blog)


class Blog(BaseModel):
    title = models.TextField(null=False, default='')
    blog_text = models.TextField(null=False, default='')
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True, null=False)
    category = models.CharField(max_length=50, null=False, default="general")

    objects = BlogManager()

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'blog_text': self.blog_text,
            'category': self.category,
            'user': self.user.serialize(),
            'created_on': self.created_on,
            'updated_on': self.updated_on,
        }

    def modify_likes(self):
        self.likes = self.likes+1
        self.save()
        return {'likes': self.likes}

    @classmethod
    def create(cls, **kwargs):
        blog = Blog(
            title=kwargs.get('title'),
            blog_text=kwargs.get('blog_text'),
            user=kwargs.get('user'),
            category=kwargs.get('category')
        )
        if kwargs.get('updated_on'):
            blog.updated_on = kwargs.get('updated_on'),

        blog.save()
        return blog


