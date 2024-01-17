from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data['access']
            refresh_token = response.data['refresh']

            response.set_cookie(
                key='access_token', value=access_token, httponly=True, max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'], samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'], secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE']
            )
            response.set_cookie(
                key='refresh_token', value=refresh_token, httponly=True, max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'], samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'], secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE']
            )
            # response.set_cookie(
            #     key='isAuthed', value='t', httponly=False, max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'], samesite='None', secure=True
            # )
            # Don't include the access and refresh token in the response body
            del response.data['access']
            del response.data['refresh']
        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response({"detail": "No refresh token provided."}, status=status.HTTP_400_BAD_REQUEST)
        request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data['access']
            response.set_cookie(
                key='access_token', value=access_token, httponly=True, max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'], samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'], secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE']
            )
            # response.set_cookie(
            #     key='isAuthed', value='t', httponly=False, max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'], samesite='None', secure=True
            # )
            # Remove access token from response body
            del response.data['access']
        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        # response.delete_cookie('isAuthed')
        return response
