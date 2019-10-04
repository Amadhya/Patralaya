from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from api.models import *


@csrf_exempt
def get_feed(request):
    if request.method == 'GET':
        feed = []
        post_list = Post.objects.all().order_by('updated_on')

        for post in reversed(post_list):
            comment_list = Comment.objects.get_by_post_id(post=post)
            comments_on_post = []

            for comment in comment_list:
                comments_on_post.append(comment.serialize())

            kwargs = {
                'post': post,
            }
            likes_list = Like.objects.filter_like(filter_by_both=False, **kwargs)
            likes = []

            for like in likes_list:
                likes.append(like.serialize())

            feed.append({
                'post': post.serialize(),
                'likes': likes,
                'comments': comments_on_post
            })

        response = {
            'status': 200,
            'feed': feed,
        }
        return JsonResponse(response)
