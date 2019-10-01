from django.db import models
from .users import User

from .base import BaseModel


class PostManager(models.Manager):
    def get_by_user_id(self, user):
        return self.filter(user=user)

    def get_by_id(self, post_id):
        return self.filter(id=post_id).first()


class Post(BaseModel):
    post_text = models.TextField(null=False, default='')
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True, null=False)

    objects = PostManager()

    def serialize(self):
        return {
            'id': self.id,
            'post_text': self.post_text,
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
        )
        if kwargs.get('updated_on'):
            post.updated_on = kwargs.pop('updated_on'),

        post.save()
        return post


