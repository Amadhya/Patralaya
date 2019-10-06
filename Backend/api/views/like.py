import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from api.models import *
from .authorization import authenticate


@csrf_exempt
def create_like(request):
    if request.method == 'POST' and authenticate(request):
        body = json.loads(request.body)
        user = User.objects.get_by_id(body.pop('user_id'))
        post = Post.objects.get_by_id(body.pop('post_id'))

        kwargs = {
            'user': user,
            'post': post
        }

        like = Like.objects.filter_like(filter_by_both=True, **kwargs)

        if not like:
            like = Like.create(**kwargs)

            return JsonResponse(like.serialize())

        response = JsonResponse({'status': 400, 'message': 'Already Liked'}, status=400)
        return response


@csrf_exempt
def delete_like(request):
    if request.method == 'DELETE' and authenticate(request):
        body = json.loads(request.body)
        user = User.objects.get_by_id(body.pop('user_id'))
        post = Post.objects.get_by_id(body.pop('post_id'))

        kwargs = {
            'user': user,
            'post': post
        }

        Like.objects.filter_like(filter_by_both=True, **kwargs).delete()
        response = {
            'status': 200,
        }
        return JsonResponse(response)
