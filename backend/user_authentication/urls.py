from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RegisterView, CustomTokenObtainPairView, LogoutView
from rest_framework_simplejwt.views import TokenRefreshView

# Initialize the router
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Access/Refresh token generation
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh token endpoint
    path('logout/', LogoutView.as_view(), name='logout'),  # Logout endpoint
    path('', include(router.urls)),
]
