import json
from rest_framework.decorators import api_view
from django.http.response import JsonResponse, HttpResponse

from api.models import *
from .authorization import authenticate

@api_view(['POST'])
def comment_text(request):
    is_auth, email = authenticate(request)
    if request.method == 'POST' and is_auth:
        body = json.loads(request.body)
        user = User.objects.get_by_email(email)
        blog = Blog.objects.get_by_id(body.pop('blog_id'))
        body = {
            'user': user,
            'blog': blog,
            **body,
        }
        comment = Comment.create(**body)

        response = {
            'status': 200,
            **comment.serialize()
        }

        return JsonResponse(response, status=200)


@api_view(['PATCH'])
def edit_comment(request, comment_id):
    if request.method == 'PATCH' and authenticate(request):
        body = json.loads(request.body)
        comment = Comment.objects.get_by_id(comment_id)
        if body.get('comment_text') and comment:
            comment.comment_text = body.pop('comment_text')
            comment.save()
            response = {
                'status': 200,
            }
            return JsonResponse(response)

        return HttpResponse({'Error': "comment not saved"}, status=400)


@api_view(['DELETE'])
def delete_comment(request, comment_id):
    if request.method == 'DELETE' and authenticate(request):
        Comment.objects.get_by_id(comment_id).delete()

        response = {
            'status': 200,
        }
        return JsonResponse(response)
