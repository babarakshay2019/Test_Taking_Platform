from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django_filters import rest_framework as django_filters
from .models import Quiz, Question
from .serializers import QuizSerializer, QuestionSerializer


# Pagination class
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

# Quiz ViewSet
class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = (django_filters.DjangoFilterBackend,)
    ordering_fields = ['title', 'created_at', 'updated_at']
    filterset_fields = ['title', 'passing_score']

    def perform_create(self, serializer):
        """Override the perform_create method to set the created_by field"""
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        """Override the perform_update method to set the updated_by field"""
        serializer.save(updated_by=self.request.user)

# Question ViewSet
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = (django_filters.DjangoFilterBackend,)
    ordering_fields = ['question_text', 'created_at', 'updated_at']
    filterset_fields = ['quiz', 'question_type']

    def perform_create(self, serializer):
        """Override the perform_create method to set the created_by field"""
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        """Override the perform_update method to set the updated_by field"""
        serializer.save(updated_by=self.request.user)