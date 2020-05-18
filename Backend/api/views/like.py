import json
from rest_framework.decorators import api_view
from django.http.response import JsonResponse

from api.models import *
from .authorization import authenticate


@api_view(['POST'])
def create_like(request):
    is_auth, email = authenticate(request)
    if request.method == 'POST' and is_auth:
        body = json.loads(request.body)
        user = User.objects.get_by_email(email)
        blog = Blog.objects.get_by_id(body.pop('blog_id'))

        kwargs = {
            'user': user,
            'blog': blog
        }

        like = Like.objects.filter_like(filter_by_both=True, **kwargs)

        if not like:
            like = Like.create(**kwargs)

            response = {
                'status': 200,
                **like.serialize()
            }

            return JsonResponse(response, status=200)

        response = JsonResponse({'status': 400, 'message': 'Already Liked'}, status=400)
        return response


@api_view(['DELETE'])
def delete_like(request):
    is_auth, email = authenticate(request)
    if request.method == 'DELETE' and is_auth:
        body = json.loads(request.body)
        user = User.objects.get_by_email(email)
        blog = Blog.objects.get_by_id(body.pop('blog_id'))

        kwargs = {
            'user': user,
            'blog': blog
        }

        Like.objects.filter_like(filter_by_both=True, **kwargs).delete()
        response = {
            'status': 200,
        }
        return JsonResponse(response)
