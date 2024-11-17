import logging
from django.contrib.auth.models import User
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import RegisterSerializer, UserSerializer, LogoutSerializer

# Use custom logger defined in settings.py
logger = logging.getLogger('app')


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    queryset = User.objects.all()

    def post(self, request):
        logger.info("Register request received with data: %s", request.data)
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            logger.info("User %s registered successfully.", user.username)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user_id": user.id,
                    "username": user.username,
                },
                status=status.HTTP_201_CREATED,
            )
        logger.warning("Invalid registration request: %s", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        logger.info("Token obtain request received.")
        return super().post(request, *args, **kwargs)


class UserViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "delete"]

    def list(self, request, *args, **kwargs):
        logger.info("Fetching user list.")
        return super().list(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        logger.info("Updating user with ID: %s", kwargs.get('pk'))
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        logger.info("Deleting user with ID: %s", kwargs.get('pk'))
        return super().destroy(request, *args, **kwargs)


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LogoutSerializer

    def post(self, request, *args, **kwargs):
        logger.info("Logout request initiated for user: %s", request.user.username)

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            try:
                refresh_token = serializer.validated_data["refresh"]
                logger.debug("Processing refresh token: %s", refresh_token)

                token = RefreshToken(refresh_token)
                token.blacklist()
                logger.info("Logout successful for user: %s", request.user.username)
                return Response({"detail": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
            except Exception as e:
                logger.error("Error during logout for user %s: %s", request.user.username, str(e))
                return Response({"error": "Bad request"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            logger.warning("Invalid logout request for user %s: %s", request.user.username, serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
