import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from api.models import *
from .authorization import authenticate


@csrf_exempt
def comment_text(request):
    if request.method == 'POST' and authenticate(request):
        body = json.loads(request.body)
        user = User.objects.get_by_id(body.pop('user_id'))
        post = Post.objects.get_by_id(body.pop('post_id'))
        body = {
            'user': user,
            'post': post,
            **body,
        }
        comment = Comment.create(**body)

        return JsonResponse(comment.serialize())