import json
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from api.models import *
from .authorization import authenticate


@csrf_exempt
def create_blog(request):
    is_auth, email = authenticate(request)
    if request.method == 'POST' and is_auth:
        body = json.loads(request.body)
        user = User.objects.get_by_email(email)
        body = {
            'user': user,
            **body,
        }
        if body.get('blog_text') == '' or body.get('title') == '':
            response = {'message': 'Please write something', 'status': 400}
            return JsonResponse(response, status=400)

        if body.get('category'):
            blog = Blog.create(**body)
            response = {
                'status': 200,
                'blog': blog.serialize()
            }
            return JsonResponse(response, status=200)

        response = {'message': 'Please select category', 'status': 400}
        return JsonResponse(response, status=400)

    response = {'message': 'not authorized', 'status': 500}
    return JsonResponse(response, status=500)

@csrf_exempt
def get_blog(request, blog_id):
    if request.method == 'GET':
        blog = Blog.objects.get_by_id(blog_id)

        if blog:
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

            
            response = {
                'status': 200,
                'blog': blog.serialize(),
                'likes': likes,
                'comments': comments_on_blog
            }

            return JsonResponse(response, status=200)
        
        response = {'message': 'Invalid blog id', 'status': 400}
        return JsonResponse(response, status=400)

@csrf_exempt
def blogs_by_user(request, user_id):
    is_auth, email = authenticate(request)
    if request.method == 'GET' and is_auth:
        user = User.objects.get_by_id(user_id)
        data = Blog.objects.get_by_user_id(user).order_by('updated_on')
        feed = []

        for blog in reversed(data):
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
            'user': user.serialize(),
        }
        return JsonResponse(response)


@csrf_exempt
def edit_blog(request, blog_id):
    if request.method == 'PATCH' and authenticate(request):
        body = json.loads(request.body)
        blog = Blog.objects.get_by_id(blog_id)
        if (body.get('blog_text') or body.get('title')) and blog:
            blog.blog_text = body.pop('blog_text')
            blog.title = body.pop('title')
            blog.save()
            response = {
                'status': 200,
            }
            return JsonResponse(response)

        response = {
            'status': 400,
        }
        return JsonResponse(response)

@csrf_exempt
def delete_blog(request, blog_id):
    if request.method == 'DELETE' and authenticate(request):
        Blog.objects.get_by_id(blog_id).delete()

        response = {
            'status': 200,
        }
        return JsonResponse(response)
