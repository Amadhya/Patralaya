from django.db import models

from .posts import Post
from .users import User
from .base import BaseModel


class LikeManager(models.Manager):
    def filter_like(self, filter_by_both, **kwargs):
        post = kwargs.get('post')
        user = kwargs.get('user')

        like = None

        if post:
            like = self.filter(post_field=post)
            if filter_by_both and not like:
                return like

        if user:
            like = self.filter(user=user)

        return like

    def get_by_user_id(self, user):
        return self.filter(user=user).first()


class Like(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True, null=False)
    post_field = models.ForeignKey(Post, on_delete=models.CASCADE, db_index=True, null=False)

    objects = LikeManager()

    def serialize(self):
        return {
            'id': self.id,
            'user': self.user.serialize(),
            'created_on': self.created_on,
            'updated_on': self.updated_on,
        }

    @classmethod
    def create(cls, **kwargs):
        like = Like(
            user=kwargs.pop('user'),
            post_field=kwargs.pop('post')
        )

        like.save()
        return like
