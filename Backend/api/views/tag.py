import json
from rest_framework.decorators import api_view
from django.http.response import JsonResponse

from api.models import *
from .authorization import authenticate


@api_view(['GET'])
def tag_blogs(request,tag_title):
    if request.method == 'GET':
        tag = Tag.objects.get_by_title(tag_title)

        blogs = tag.blog_set.all()

        blog_list = []

        for blog in blogs:
            blog_list.append(blog.serialize())

        response = {
            'status': 200,
            'blogs': blog_list
        }

        return JsonResponse(response, status=200)