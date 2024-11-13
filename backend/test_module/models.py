from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="%(class)s_created", 
        on_delete=models.SET_NULL, null=True, blank=True
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="%(class)s_updated", 
        on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        abstract = True

class Quiz(BaseModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    passing_score = models.FloatField(default=70)

    def __str__(self):
        return self.title

class Question(BaseModel):
    QUESTION_TYPES = [
        ('MCQ', 'Single-answer MCQ'),
        ('MULTI', 'Multiple-answer MCQ'),
        ('FILL', 'Fill in the blank'),
        ('YN', 'Yes/No'),
    ]

    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    question_type = models.CharField(max_length=5, choices=QUESTION_TYPES)
    question_text = models.CharField(max_length=1024, null=True)
    options = models.JSONField(null=True)
    answer = models.CharField(max_length=1024, null=True)
    explanation = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.question_text[:50]}..."


class UserQuizAttempt(BaseModel):
    STATUSES = [
        ('resumed','resumed'),
        ('completed','completed')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.FloatField()
    status = models.CharField(max_length=128, default="", choices=STATUSES)
    passed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - Score: {self.score}"

class UserAnswer(BaseModel):
    user_attempt = models.ForeignKey(UserQuizAttempt, related_name='answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.CharField(max_length=1024)

    def __str__(self):
        return f"Attempt {self.user_attempt.id} - Question {self.question.id}"