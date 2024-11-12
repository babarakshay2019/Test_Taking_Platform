from django.contrib.auth.models import User
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import RegisterSerializer, UserSerializer, LogoutSerializer
import logging

logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    queryset = User.objects.all()

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user_id": user.id,
                    "username": user.username,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "patch", "delete"]


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LogoutSerializer

    def post(self, request, *args, **kwargs):
        # Log incoming request data
        logger.debug(f"Incoming request data: {request.data}")

        # Deserialize and validate the input data
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            try:
                refresh_token = serializer.validated_data["refresh"]
                # Log the refresh token for debugging
                logger.debug(f"Refreshing token: {refresh_token}")

                # Blacklist the refresh token
                token = RefreshToken(refresh_token)
                token.blacklist()  # Blacklist the refresh token
                return Response(
                    {"detail": "Logout successful"},
                    status=status.HTTP_205_RESET_CONTENT,
                )
            except Exception as e:
                # Log the exception for debugging
                logger.error(f"Error during logout: {str(e)}")
                return Response(
                    {"error": "Bad request"}, status=status.HTTP_400_BAD_REQUEST
                )
        else:
            # Log serializer errors for debugging
            logger.error(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
