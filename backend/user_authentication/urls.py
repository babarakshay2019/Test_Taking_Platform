from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Access/Refresh token generation
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh token endpoint
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

# Initialize the router
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

# Register URLs with the router
urlpatterns += [
    path('', include(router.urls)),
]