from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

from project_models.models.user import User
from ..serializers.user_serializers import UserRegistrationSerializer, ChangePasswordSerializer, UserSerializer


class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 201:
            user = User.objects.get(username=response.data['username'])
            refresh = RefreshToken.for_user(user)

            response.set_cookie(
                key='access_token', value=str(refresh.access_token), httponly=True, max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'], samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'], secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE']
            )
            response.set_cookie(
                key='refresh_token', value=str(refresh), httponly=True, max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'], samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'], secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE']
            )
        return response


class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # Set the new password
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response({"status": "success", "message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Return the current user
        return self.request.user
