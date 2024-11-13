from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuizViewSet, QuestionViewSet

# Initialize the router
router = DefaultRouter()
router.register(r'quizzes', QuizViewSet)
router.register(r'questions', QuestionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

from django.urls import path
from .views import QuestionSubmitView, QuizResumeView, QuizCompleteView

urlpatterns += [
    path('quizzes/<int:quiz_id>/questions/<int:question_id>/submit/', QuestionSubmitView.as_view(), name='question-submit'),
    path('quizzes/<int:quiz_id>/resume/', QuizResumeView.as_view(), name='quiz-resume'),
    path('quizzes/<int:quiz_id>/complete/', QuizCompleteView.as_view(), name='quiz-complete'),
]

