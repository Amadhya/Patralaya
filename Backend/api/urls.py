from django.urls import path

from api.views import *

urlpatterns = [
    path('feed', get_feed, name='feed'),
    path('profile/<uuid:user_id>', user_profile, name='user profile'),
    path('post', post_text, name='post'),
    path('post/<uuid:user_id>', posts_by_user, name='posts by user'),
    path('delete_post', delete_post, name='delete post'),
    path('post/edit/<uuid:post_id>', edit_post, name='edit post'),
    path('comment', comment_text, name='comment'),
    path('delete_comment', delete_comment, name='delete comment'),
    path('comment/edit/<uuid:comment_id>', edit_comment, name='edit comment'),
    path('like', create_like, name='like'),
    path('unlike', delete_like, name='unlike'),
    path('login', login, name='login'),
    path('signup', signin, name='signup'),
]
