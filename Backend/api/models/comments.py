from django.db import models
from .users import User
from .blogs import Blog
from .base import BaseModel


class CommentManager(models.Manager):
    def get_by_user_id(self, user):
        return self.filter(user=user)

    def get_by_blog_id(self, blog):
        return self.filter(blog_field=blog)

    def get_by_id(self, comment_id):
        return self.filter(id=comment_id).first()


class Comment(BaseModel):
    comment_text = models.TextField(null=False, default='')
    likes = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True, null=False)
    blog_field = models.ForeignKey(Blog, on_delete=models.CASCADE, db_index=True, null=False)

    objects = CommentManager()

    def serialize(self):
        return {
            'id': self.id,
            'comment_text': self.comment_text,
            'user': self.user.serialize(),
            'blog_id': self.blog_field.id,
            'likes': self.likes,
            'created_on': self.created_on,
            'updated_on': self.updated_on,
        }

    @classmethod
    def create(cls, **kwargs):
        comment = Comment(
            comment_text=kwargs.get('comment_text'),
            user=kwargs.get('user'),
            blog_field=kwargs.get('blog'),
        )
        if kwargs.get('updated_on'):
            comment.updated_on = kwargs.get('updated_on'),

        comment.save()
        return comment


