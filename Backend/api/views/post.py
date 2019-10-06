import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from api.models import *
from .authorization import authenticate


@csrf_exempt
def post_text(request):
    if request.method == 'POST' and authenticate(request):
        body = json.loads(request.body)
        user = User.objects.get_by_id(body.pop('user_id'))
        body = {
            'user': user,
            **body,
        }
        if body.get('post_text') == '':
            response = {'message': 'Please write something', 'status': 400}
            return JsonResponse(response)

        if body.get('category'):
            post = Post.create(**body)
            return JsonResponse(post.serialize())

        response = {'message': 'Please select category', 'status': 400}
        return JsonResponse(response)


@csrf_exempt
def posts_by_user(request, user_id):
    if request.method == 'GET' and authenticate(request):
        user = User.objects.get_by_id(user_id)
        data = Post.objects.get_by_user_id(user).order_by('updated_on')
        feed = []

        for post in reversed(data):
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


@csrf_exempt
def edit_post(request, post_id):
    if request.method == 'PATCH' and authenticate(request):
        body = json.loads(request.body)
        post = Post.objects.get_by_id(post_id)
        if body.get('post_text') and post:
            post.post_text = body.pop('post_text')
            post.save()
            response = {
                'status': 200,
            }
            return JsonResponse(response)

        response = {
            'status': 400,
        }
        return JsonResponse(response)


@csrf_exempt
def delete_post(request):
    if request.method == 'DELETE' and authenticate(request):
        body = json.loads(request.body)
        Post.objects.get_by_id(body.pop('post_id')).delete()

        response = {
            'status': 200,
        }
        return JsonResponse(response)