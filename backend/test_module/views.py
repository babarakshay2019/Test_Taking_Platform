from django.db.models import Prefetch
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework.exceptions import ValidationError
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from rest_framework.exceptions import ValidationError
import logging
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django_filters import rest_framework as django_filters
from django.shortcuts import get_object_or_404
from datetime import timezone

from .models import Quiz, Question, UserQuizAttempt, UserAnswer
from .serializers import (
    QuizSerializer, QuestionSerializer, 
    UserAnswerSerializer, UserQuizAttemptSerializer, 
    LeaderboardSerializer
)

# Set up logger
logger = logging.getLogger('app')

# Pagination
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'page_size': self.page.paginator.per_page,
            'total_pages': self.page.paginator.num_pages,
            'total_items': self.page.paginator.count,
            'current_page': self.page.number,
            'results': data
        })


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
        logger.info("Creating quiz by user: %s", self.request.user.username)
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        logger.info("Updating quiz by user: %s", self.request.user.username)
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
        logger.info("Creating question for quiz ID: %s", self.request.data.get('quiz'))
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        logger.info("Updating question with ID: %s", self.request.data.get('id'))
        serializer.save(updated_by=self.request.user)


# Start Quiz
class StartQuizView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserQuizAttemptSerializer

    def post(self, request, quiz_id, *args, **kwargs):
        logger.info("Start quiz request received for quiz ID: %s by user: %s", quiz_id, request.user.username)
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        
        user_attempt, _ = UserQuizAttempt.objects.get_or_create(
            user=request.user, quiz=quiz, status='resumed', defaults={'score': 0, 'passed': False}
        )
        
        # Clear previous answers if restarting quiz
        UserAnswer.objects.filter(user_attempt=user_attempt).delete()
        
        questions = quiz.questions.order_by('?')[:10]
        merged_data = [
            {
                **QuestionSerializer(question).data,
                'student_answer': UserAnswer.objects.get_or_create(
                    user_attempt=user_attempt,
                    question=question,
                    defaults={'selected_option': '', 'created_by': request.user, 'updated_by': request.user}
                )[0].selected_option
            }
            for question in questions
        ]

        response_data = {
            'quiz': {
                **QuizSerializer(quiz).data,
                'status': user_attempt.status  # Add status from the UserQuizAttempt
            },
            'questions': merged_data
        }
        
        logger.info("Quiz started successfully for user: %s", request.user.username)
        return Response(response_data, status=status.HTTP_201_CREATED)


# Question Submit
class QuestionSubmitView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserAnswerSerializer

    def post(self, request, quiz_id, question_id, *args, **kwargs):
        logger.info("Submitting answer for quiz ID: %s, question ID: %s by user: %s", quiz_id, question_id, request.user.username)
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        question = get_object_or_404(Question, pk=question_id)
        
        user_attempt, _ = UserQuizAttempt.objects.get_or_create(
            user=request.user, quiz=quiz, status='resumed', defaults={'score': 0, 'passed': False}
        )

        user_answer, created = UserAnswer.objects.update_or_create(
            user_attempt=user_attempt, question=question,
            defaults={
                'selected_option': request.data.get('selected_option'),
                'updated_by': request.user,
            }
        )
        serializer = self.get_serializer(user_answer)
        logger.info("Answer submitted successfully for quiz ID: %s, question ID: %s", quiz_id, question_id)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


# Quiz Complete
class QuizCompleteView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserQuizAttemptSerializer

    def post(self, request, quiz_id, *args, **kwargs):
        logger.info("Completing quiz for quiz ID: %s by user: %s", quiz_id, request.user.username)
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        user_attempt = get_object_or_404(UserQuizAttempt, user=request.user, quiz=quiz, status='resumed')
        
        correct_answers = sum(
            1 for question in quiz.questions.all()
            if UserAnswer.objects.filter(user_attempt=user_attempt, question=question, selected_option=question.answer).exists()
        )

        user_attempt.score = (correct_answers / quiz.questions.count()) * 100
        user_attempt.status = 'completed'
        user_attempt.passed = user_attempt.score >= quiz.passing_score
        user_attempt.updated_by = request.user
        user_attempt.save()

        serializer = self.get_serializer(user_attempt)
        logger.info("Quiz completed successfully for user: %s", request.user.username)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Leaderboard
class LeaderboardView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LeaderboardSerializer

    def get(self, request, quiz_id, *args, **kwargs):
        logger.info("Fetching leaderboard for quiz ID: %s", quiz_id)
        leaderboard = UserQuizAttempt.objects.filter(quiz_id=quiz_id).order_by('-score', 'created_at').select_related('user')
        serializer = self.get_serializer(leaderboard, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserTestsView(GenericAPIView):
    """
    Fetch all quizzes attempted by the user with statuses 'completed' or 'resumed'.
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name="status",
                description="Filter tests by status. Allowed values: 'completed', 'resumed'.",
                required=False,
                type=str,
                examples=[
                    OpenApiExample(
                        "Completed",
                        value="completed",
                        description="Retrieve only completed tests."
                    ),
                    OpenApiExample(
                        "Resumed",
                        value="resumed",
                        description="Retrieve only resumed tests."
                    ),
                ],
            )
        ],
        responses={200: None},  # Replace with the appropriate serializer class if needed
    )
    def get(self, request, *args, **kwargs):
        logger.info("Fetching quizzes attempted by user: %s", request.user.username)

        # Extract the status filter from query parameters
        status_filter = request.query_params.get('status')
        allowed_statuses = ['completed', 'resumed']

        if status_filter:
            # Validate the status filter
            if status_filter not in allowed_statuses:
                raise ValidationError({'status': f"Invalid status. Allowed values are {allowed_statuses}."})
            statuses = [status_filter]
        else:
            # Default to all allowed statuses
            statuses = allowed_statuses

        # Fetch user attempts based on the filtered statuses
        user_attempts = UserQuizAttempt.objects.filter(
            user=request.user,
            status__in=statuses
        ).select_related('quiz')

        # Prepare response data
        response_data = [
            {
                'quiz': QuizSerializer(attempt.quiz).data,
                'status': attempt.status,
                'score': attempt.score,
                'passed': attempt.passed,
            }
            for attempt in user_attempts
        ]

        logger.info("Tests fetched successfully for user: %s with status: %s", request.user.username, statuses)
        return Response(response_data, status=status.HTTP_200_OK)


# Get Single Test Details
class SingleTestDetailsView(GenericAPIView):
    """
    Fetch detailed information about a specific quiz attempted by the user,
    including randomized questions and clearing previous answers if the quiz is restarted.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = QuizSerializer

    def get(self, request, quiz_id, *args, **kwargs):
        logger.info("Fetching details for quiz ID: %s by user: %s", quiz_id, request.user.username)

        # Fetch the quiz and user attempt
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        user_attempt = get_object_or_404(UserQuizAttempt, user=request.user, quiz_id=quiz_id, status='resumed')

        # Clear previous answers if restarting the quiz
        UserAnswer.objects.filter(user_attempt=user_attempt).delete()

        # Fetch randomized questions (e.g., first 10) and attach user's answer
        questions = quiz.questions.order_by('?')[:10]
        merged_data = [
            {
                **QuestionSerializer(question).data,
                'student_answer': UserAnswer.objects.get_or_create(
                    user_attempt=user_attempt,
                    question=question,
                    defaults={'selected_option': '', 'created_by': request.user, 'updated_by': request.user}
                )[0].selected_option
            }
            for question in questions
        ]

        # Prepare the response data
        response_data = {
            'quiz': {
                **QuizSerializer(quiz).data,
                'status': user_attempt.status,  # Add status from UserQuizAttempt
            },
            'questions': merged_data,
        }

        logger.info("Quiz details fetched successfully for user: %s", request.user.username)
        return Response(response_data, status=status.HTTP_200_OK)
