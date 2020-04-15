from django.urls import path

from api.views import *

urlpatterns = [
    path('blog/feed', get_blog_feed, name='feed'),
    path('blog/<str:blog_id>', get_blog, name='blog'),
    path('profile', user_profile, name='user profile'),
    path('blog', create_blog, name='blog'),
    path('user/blogs/<uuid:user_id>', blogs_by_user, name='blogs by user'),
    path('blog/delete/<uuid:blog_id>', delete_blog, name='delete blog'),
    path('blog/edit/<uuid:blog_id>', edit_blog, name='edit blog'),
    path('comment', comment_text, name='comment'),
    path('comment/delete/<uuid:comment_id>', delete_comment, name='delete comment'),
    path('comment/edit/<uuid:comment_id>', edit_comment, name='edit comment'),
    path('like', create_like, name='like'),
    path('unlike', delete_like, name='unlike'),
    path('google_login_access_token', google_login_access_token, name='google login access token'),
    path('login', login, name='login'),
    path('signup', signin, name='signup'),
    path('user/profile/edit', edit_user_details, name='edit user details'),
    path('user/password/edit', change_password, name='change password'),
]
