from django.db import models

from .blogs import Blog
from .users import User
from .base import BaseModel


class LikeManager(models.Manager):
    def filter_like(self, filter_by_both, **kwargs):
        blog = kwargs.get('blog')
        user = kwargs.get('user')

        like = None

        if blog:
            like = self.filter(blog_field=blog)
            if filter_by_both and not like:
                return like

        if user:
            like = self.filter(user=user)

        return like

    def get_by_user_id(self, user):
        return self.filter(user=user).first()


class Like(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True, null=False)
    blog_field = models.ForeignKey(Blog, on_delete=models.CASCADE, db_index=True, null=False)

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
            user=kwargs.get('user'),
            blog_field=kwargs.get('blog')
        )

        like.save()
        return like
