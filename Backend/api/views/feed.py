from rest_framework.decorators import api_view
from django.http.response import JsonResponse

from api.models import *
from .authorization import authenticate


@api_view(['GET'])
def get_blog_feed(request):
    if request.method == 'GET':
        feed = []
        filter_blog = request.GET.get('filter')

        if filter_blog != '':
            blog_list = Blog.objects.filter_by_category(filter_blog).order_by('updated_on')
        else:
            blog_list = Blog.objects.all().order_by('updated_on')

        for blog in reversed(blog_list):
            comment_list = Comment.objects.get_by_blog_id(blog=blog)
            comments_on_blog = []

            for comment in comment_list:
                comments_on_blog.append(comment.serialize())

            kwargs = {
                'blog': blog,
            }
            likes_list = Like.objects.filter_like(filter_by_both=False, **kwargs)
            likes = []

            for like in likes_list:
                likes.append(like.serialize())

            feed.append({
                'blog': blog.serialize(),
                'likes': likes,
                'comments': comments_on_blog
            })

        response = {
            'status': 200,
            'feed': feed,
        }
        return JsonResponse(response)
