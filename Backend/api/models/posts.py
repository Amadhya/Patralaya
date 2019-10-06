from django.db import models
from .users import User

from .base import BaseModel


class PostManager(models.Manager):
    def get_by_user_id(self, user):
        return self.filter(user=user)

    def get_by_id(self, post_id):
        return self.filter(id=post_id).first()

    def filter_by_category(self, filter_post):
        return self.filter(category=filter_post)


class Post(BaseModel):
    post_text = models.TextField(null=False, default='')
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True, null=False)
    category = models.CharField(max_length=50, null=False, default="general")

    objects = PostManager()

    def serialize(self):
        return {
            'id': self.id,
            'post_text': self.post_text,
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
        post = Post(
            post_text=kwargs.pop('post_text'),
            user=kwargs.pop('user'),
            category=kwargs.pop('category')
        )
        if kwargs.get('updated_on'):
            post.updated_on = kwargs.pop('updated_on'),

        post.save()
        return post


