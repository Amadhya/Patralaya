from django.urls import path

from . import views

urlpatterns = [
    path('feed', views.get_feed, name='feed'),
    path('current_user', views.current_user, name='current_user'),
    path('post', views.post_text, name='post'),
    path('post/<uuid:user_id>', views.posts_by_user, name='posts by user'),
    path('delete_post', views.delete_post, name='delete post'),
    path('comment', views.comment_text, name='comment'),
    path('like', views.create_like, name='like'),
    path('unlike', views.delete_like, name='unlike'),
    path('login', views.login, name='login'),
    path('signup', views.signin, name='signup'),
]