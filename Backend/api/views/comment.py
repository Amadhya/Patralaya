import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse, HttpResponse

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


@csrf_exempt
def edit_comment(request, comment_id):
    if request.method == 'PATCH' and authenticate(request):
        body = json.loads(request.body)
        comment = Comment.objects.get_by_id(comment_id)
        print(comment)
        print(body.get('comment_text'))
        if body.get('comment_text') and comment:
            comment.comment_text = body.pop('comment_text')
            comment.save()
            response = {
                'status': 200,
            }
            return JsonResponse(response)

        return HttpResponse({'Error': "comment not saved"}, status=400)


@csrf_exempt
def delete_comment(request):
    if request.method == 'DELETE' and authenticate(request):
        body = json.loads(request.body)
        Comment.objects.get_by_id(body.pop('comment_id')).delete()

        response = {
            'status': 200,
        }
        return JsonResponse(response)
