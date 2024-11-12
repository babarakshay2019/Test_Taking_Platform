from rest_framework import serializers
from .models import Quiz, Question
from django.contrib.auth import get_user_model

# BaseModel Serializer
class BaseModelSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    updated_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        abstract = True
        fields = ('created_at', 'updated_at', 'created_by', 'updated_by')

# Quiz Serializer
class QuizSerializer(BaseModelSerializer):
    class Meta:
        model = Quiz
        fields = ('id', 'title', 'description', 'passing_score', 'created_at', 'updated_at', 'created_by', 'updated_by')

# Question Serializer
class QuestionSerializer(BaseModelSerializer):
    quiz = serializers.PrimaryKeyRelatedField(queryset=Quiz.objects.all())
    options = serializers.JSONField()

    class Meta:
        model = Question
        fields = ('id', 'quiz', 'question_type', 'question_text', 'options', 'explanation', 'created_at', 'updated_at', 'created_by', 'updated_by')
    