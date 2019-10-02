import json
import jwt
from rest_framework import exceptions
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse, HttpResponse
from rest_framework.authentication import get_authorization_header

from .models import *


@csrf_exempt
def login(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        email = body['email']

        if User.objects.get_by_email(email=email) is None:
            response = JsonResponse({'status': 400, 'message': 'Username or Password is not correct'}, status=400)
            return response

        password = body['password']
        user = User.objects.authenticate(email=email, password=password)

        if user is not None:
            # print(user.email)
            payload = {
                'email': user.email,
                'password': user.password,
            }
            jwt_token = {'token': jwt.encode(payload, "SECRET_KEY").decode('utf-8')}

            response = {
                'status': 200,
                'user_id': user.id,
                'token': jwt_token.get('token'),
            }

            return JsonResponse(response)

        response = JsonResponse({'status': 400, 'message': 'Username or Password is not correct'}, status=400)
        return response


@csrf_exempt
def signin(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        email = body.pop('email')
        password = body.pop('password')
        user = User.objects.get_by_email(email=email)

        if user is None:
            user = User.objects.create_user(email=email, password=password, **body)
            payload = {
                'email': user.email,
                'password': user.password,
            }
            jwt_token = {'token': jwt.encode(payload, "SECRET_KEY").decode('utf-8')}

            response = {
                'status': 200,
                'user_id': user.id,
                'token': jwt_token.get('token'),
            }

            return JsonResponse(response)

        response = JsonResponse({'status': 400, 'message': 'This email is already registered'}, status=400)
        return response


@csrf_exempt
def current_user(request):
    if request.method == 'POST':
        auth = get_authorization_header(request).split()

        if not auth or auth[0].lower() != b'bearer':
            return None

        if len(auth) == 1:
            msg = 'Invalid token header. No credentials provided.'
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = 'Invalid token header'
            raise exceptions.AuthenticationFailed(msg)

        try:
            token = auth[1]
            if token == "null":
                msg = 'Null token not allowed'
                raise exceptions.AuthenticationFailed(msg)
        except UnicodeError:
            msg = 'Invalid token header. Token string should not contain invalid characters.'
            raise exceptions.AuthenticationFailed(msg)

        user, token = authenticate_using_token(token)

        return JsonResponse({'user': user.serialize(), 'token': token.decode('utf-8')})


@csrf_exempt
def post_text(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        user = User.objects.get_by_id(body.pop('user_id'))
        body = {
            'user': user,
            **body,
        }
        post = Post.create(**body)

        return JsonResponse(post.serialize())


@csrf_exempt
def posts_by_user(request, user_id):
    if request.method == 'GET':
        user = User.objects.get_by_id(user_id)
        data = Post.objects.get_by_user_id(user)
        feed = []
        print(data, '--------------------------------------')

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
def create_like(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        user = User.objects.get_by_id(body.pop('user_id'))
        post = Post.objects.get_by_id(body.pop('post_id'))

        kwargs = {
            'user': user,
            'post': post
        }

        like = Like.objects.filter_like(filter_by_both=True, **kwargs)
        print(like)
        print(not like)
        if not like:
            like = Like.create(**kwargs)

            return JsonResponse(like.serialize())

        response = JsonResponse({'status': 400, 'message': 'Already Liked'}, status=400)
        return response


@csrf_exempt
def delete_like(request):
    if request.method == 'DELETE':
        body = json.loads(request.body)
        user = User.objects.get_by_id(body.pop('user_id'))
        post = Post.objects.get_by_id(body.pop('post_id'))

        kwargs = {
            'user': user,
            'post': post
        }

        Like.objects.filter_like(filter_by_both=True, **kwargs).delete()
        return HttpResponse(status=200)


@csrf_exempt
def comment_text(request):
    if request.method == 'POST':
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
def get_feed(request):
    if request.method == 'GET':
        feed = []
        post_list = Post.objects.all()

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


def authenticate_using_token(token):
    payload = jwt.decode(token, "SECRET_KEY")
    email = payload['email']
    password = payload['password']
    msg = {'Error': "Token mismatch", 'status': "401"}
    try:
        user = User.objects.get_by_email(email=email)
        if user.password == password:
            return user, token

        raise exceptions.AuthenticationFailed(msg)

    except jwt.ExpiredSignature or jwt.DecodeError or jwt.InvalidTokenError:
        return HttpResponse({'Error': "Token is invalid"}, status="403")
    except User is None:
        return HttpResponse({'Error': "Internal server error"}, status="500")





