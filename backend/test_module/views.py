from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from django_filters import rest_framework as django_filters
from django.shortcuts import get_object_or_404
from datetime import timezone
import random

from .models import Quiz, Question, UserQuizAttempt, UserAnswer
from .serializers import (
    QuizSerializer, QuestionSerializer, 
    UserAnswerSerializer, UserQuizAttemptSerializer, 
    LeaderboardSerializer
)


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
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
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
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)


# Start Quiz
class StartQuizView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserQuizAttemptSerializer

    def post(self, request, quiz_id, *args, **kwargs):
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        
        user_attempt, created = UserQuizAttempt.objects.get_or_create(
            user=request.user, quiz=quiz, status='resumed', defaults={'score': 0, 'passed': False}
        )

        if not created:
            UserAnswer.objects.filter(user_attempt=user_attempt).delete()

        questions = quiz.questions.order_by('?')[:10]
        merged_data = []
        
        for question in questions:
            user_answer, _ = UserAnswer.objects.get_or_create(
                user_attempt=user_attempt,
                question=question,
                defaults={'selected_option': '', 'created_by': request.user, 'updated_by': request.user}
            )
            question_info = QuestionSerializer(question).data
            question_info['student_answer'] = user_answer.selected_option
            merged_data.append(question_info)

        quiz_data = QuizSerializer(quiz).data
        response_data = {
            'quiz': quiz_data,
            'questions': merged_data
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


# Question Submit
class QuestionSubmitView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserAnswerSerializer

    def post(self, request, quiz_id, question_id, *args, **kwargs):
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        question = get_object_or_404(Question, pk=question_id)
        
        user_attempt, created = UserQuizAttempt.objects.get_or_create(
            user=request.user, quiz=quiz, status='resumed', defaults={'score': 0, 'passed': False}
        )

        user_answer = UserAnswer.objects.filter(
            user_attempt=user_attempt, question=question
        ).first()

        if user_answer:
            user_answer.selected_option = request.data.get('selected_option')
            user_answer.updated_by = request.user
            user_answer.save()
            serializer = self.get_serializer(user_answer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        answer_data = {
            'user_attempt': user_attempt.id,
            'question': question.id,
            'selected_option': request.data.get('selected_option'),
            'created_by': request.user,
            'updated_by': request.user
        }

        serializer = self.get_serializer(data=answer_data)
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user, updated_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Quiz Resume
class QuizResumeView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserQuizAttemptSerializer

    def get(self, request, quiz_id, *args, **kwargs):
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        user_attempt = get_object_or_404(UserQuizAttempt, user=request.user, quiz=quiz, status='resumed')
        serializer = self.get_serializer(user_attempt)
        return Response(serializer.data)


# Quiz Complete
class QuizCompleteView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserQuizAttemptSerializer

    def post(self, request, quiz_id, *args, **kwargs):
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        user_attempt = get_object_or_404(UserQuizAttempt, user=request.user, quiz=quiz, status='resumed')
        
        correct_answers = 0
        total_questions = quiz.questions.count()
        
        for question in quiz.questions.all():
            user_answer = UserAnswer.objects.filter(user_attempt=user_attempt, question=question).first()
            if user_answer and user_answer.selected_option == question.answer:
                correct_answers += 1

        user_attempt.score = (correct_answers / total_questions) * 100
        user_attempt.status = 'completed'
        user_attempt.passed = user_attempt.score >= quiz.passing_score
        user_attempt.updated_by = request.user
        user_attempt.save()

        serializer = self.get_serializer(user_attempt)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Leaderboard
class LeaderboardView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LeaderboardSerializer

    def get(self, request, quiz_id, *args, **kwargs):
        quiz = get_object_or_404(Quiz, pk=quiz_id)
        leaderboard = (
            UserQuizAttempt.objects.filter(quiz=quiz)
            .order_by('-score', 'created_at')
            .select_related('user')
        )

        serializer = self.get_serializer(leaderboard, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
