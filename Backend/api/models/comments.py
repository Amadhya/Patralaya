from django.db import models
from .users import User
from .posts import Post
from .base import BaseModel


class CommentManager(models.Manager):
    def get_by_user_id(self, user):
        return self.filter(user=user)

    def get_by_post_id(self, post):
        return self.filter(post_field=post)

    def get_by_id(self, comment_id):
        return self.filter(id=comment_id).first()


class Comment(BaseModel):
    comment_text = models.TextField(null=False, default='')
    likes = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True, null=False)
    post_field = models.ForeignKey(Post, on_delete=models.CASCADE, db_index=True, null=False)

    objects = CommentManager()

    def serialize(self):
        return {
            'id': self.id,
            'comment_text': self.comment_text,
            'user': self.user.serialize(),
            'post_id': self.post_field.id,
            'likes': self.likes,
            'created_on': self.created_on,
            'updated_on': self.updated_on,
        }

    @classmethod
    def create(cls, **kwargs):
        comment = Comment(
            comment_text=kwargs.pop('comment_text'),
            user=kwargs.pop('user'),
            post_field=kwargs.pop('post'),
        )
        if kwargs.get('updated_on'):
            comment.updated_on = kwargs.pop('updated_on'),

        comment.save()
        return comment


