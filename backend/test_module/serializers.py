from rest_framework import serializers
from .models import Quiz, Question
from django.contrib.auth import get_user_model
import jsonschema

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
        fields = ['id', 'quiz', 'question_type', 'question_text', 'options', 'explanation', 'created_at', 'updated_at']

    def get_options_schema(self, question_type):
        """Define JSON schema based on question type."""
        if question_type in ['MCQ', 'MULTI']:
            # For MCQ and MULTI, options should be a non-empty list of strings
            return {
                "type": "array",
                "items": {"type": "string"},
                "minItems": 1,
                "uniqueItems": True
            }
        elif question_type in ['FILL', 'YN']:
            # For FILL and YN, options should be null or empty
            return {
                "type": ["null", "array"],
                "items": {},
                "maxItems": 0
            }
        return {}

    def validate_options(self, value):
        question_type = self.initial_data.get("question_type")
        schema = self.get_options_schema(question_type)
        
        # Apply JSON schema validation using jsonschema library
        try:
            jsonschema.validate(instance=value, schema=schema)
        except jsonschema.ValidationError as e:
            raise serializers.ValidationError(f"Invalid options format: {e.message}")
        
        return value
    
from rest_framework import serializers
from .models import Quiz, Question, UserQuizAttempt, UserAnswer

class UserAnswerSerializer(serializers.ModelSerializer):
    """
    Serializer for the UserAnswer model.
    """
    created_by = serializers.ReadOnlyField(source='created_by.username')
    updated_by = serializers.ReadOnlyField(source='updated_by.username')

    class Meta:
        model = UserAnswer
        fields = ['id', 'user_attempt', 'question', 'selected_option', 'created_at', 'updated_at', 'created_by', 'updated_by']


class UserQuizAttemptSerializer(serializers.ModelSerializer):
    """
    Serializer for the UserQuizAttempt model, including nested answers.
    """
    answers = UserAnswerSerializer(many=True, read_only=True)
    created_by = serializers.ReadOnlyField(source='created_by.username')
    updated_by = serializers.ReadOnlyField(source='updated_by.username')

    class Meta:
        model = UserQuizAttempt
        fields = ['id', 'user', 'quiz', 'score', 'status', 'passed', 'created_at', 'updated_at', 'created_by', 'updated_by', 'answers']
        read_only_fields = ['user', 'quiz', 'score', 'status', 'passed']