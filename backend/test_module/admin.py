from django.contrib import admin
from .models import Quiz, Question, UserQuizAttempt, UserAnswer

class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'passing_score', 'created_at', 'created_by')
    search_fields = ('title',)
    list_filter = ('created_at', 'created_by')
    ordering = ('-created_at',)

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_text', 'question_type', 'quiz', 'created_at', 'created_by')
    search_fields = ('question_text', 'quiz__title')
    list_filter = ('quiz', 'question_type', 'created_at', 'created_by')
    ordering = ('-created_at',)
    fieldsets = (
        (None, {'fields': ('quiz', 'question_text', 'question_type', 'options', 'explanation')}),
        ('Metadata', {'fields': ('created_by', 'updated_by')}),
    )
    readonly_fields = ('created_by', 'updated_by')

class UserQuizAttemptAdmin(admin.ModelAdmin):
    list_display = ('user', 'quiz', 'score', 'status', 'passed', 'created_at')
    search_fields = ('user__username', 'quiz__title')
    list_filter = ('status', 'passed', 'created_at')
    ordering = ('-created_at',)

class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ('user_attempt', 'question', 'selected_option', 'created_at')
    search_fields = ('user_attempt__user__username', 'question__question_text')
    list_filter = ('created_at',)
    ordering = ('-created_at',)

# Register the models with the admin site
admin.site.register(Quiz, QuizAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(UserQuizAttempt, UserQuizAttemptAdmin)
admin.site.register(UserAnswer, UserAnswerAdmin)
