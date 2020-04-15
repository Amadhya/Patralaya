import json
import requests
import jwt

from google.oauth2 import id_token
from google.auth.transport import requests as req
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse

from api.models.users import User

@csrf_exempt
def google_login_access_token(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        token = body.pop('access_token')
        payload = {'access_token': token}   # validate the token

        r = requests.get('https://www.googleapis.com/oauth2/v2/userinfo', params=payload)
        data = json.loads(r.text)

        if 'error' in data:
            content = {
                'status': '400',
                'message': 'wrong google token / this google token is already expired.'
            }
            return Response(content)

        r = requests.get('https://www.googleapis.com/oauth2/v1/userinfo', params=payload)

        data = json.loads(r.text)
        
        if 'error' in data:
            content = {
                'status': '400',
                'message': 'wrong google token / this google token is already expired.',
            }

            return JsonResponse(content,status=400)

        user = User.objects.get_by_email(email=data['email'])

        if user is None:
            kwargs = {
                'first_name': data['given_name'],
                'last_name': data['family_name'],
                'phone': '',
            }

            user = User.objects.create_user(email=data['email'],password=BaseUserManager().make_random_password(),**kwargs)

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

        return JsonResponse(response, status=200)
    
    response = {
        'status': 400,
        'message': 'Invalid request method',
    }

    return JsonResponse(response, status=400)      