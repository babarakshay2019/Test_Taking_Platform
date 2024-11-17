
# Test Taking Platform

## Overview

The **Test Taking Platform** is a web-based application designed for students to take, and manage quizzes and tests. students can attempt those quizzes and get real-time feedback on their scores. This platform also supports user authentication and provides features like leaderboard rankings, quiz resumption, and more.

## Features

- **User Authentication**: Sign up, login, and logout functionality using JWT tokens.
- **Quiz Management**: create, update, and delete quizzes. Students can attempt quizzes.
- **Leaderboard**: View top scorers for a given quiz.
- **Quiz Status**: Support for starting, resuming, and completing quizzes with dynamic scoring.
- **Question Management**: add, update, or delete questions associated with quizzes.
- **Answer Submission**: Students can submit answers for each question in a quiz.

## Technologies Used

- **Backend**: Django (4.2.16), Django REST Framework, Django-Silk (for query profiling)
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens) using `djangorestframework-simplejwt`
- **Front-end (Optional)**: React (if integrated with front-end)
- **Pagination**: Django REST Framework pagination
- **Filtering**: Django Filters for query filtering
- **Caching**: Django Cache Framework (optional for optimization)

## Installation

### Prerequisites

- Python 3.x
- PostgreSQL
- Django 4.x
- pip
- Virtualenv (optional but recommended)

### Setup

1. **Clone the repository**:

```bash
git clone https://github.com/your-username/test-taking-platform.git
cd test-taking-platform
```

2. **Create a virtual environment** (optional but recommended):

```bash
python -m venv venv
source venv/bin/activate  # For Linux/macOS
venv\Scripts\activate     # For Windows
```

3. **Install dependencies**:

```bash
pip install -r requirements.txt
```

4. **Run migrations**:

```bash
python manage.py migrate
```

5. **Create a superuser** (optional, for accessing the admin interface):

```bash
python manage.py createsuperuser
```

6. **Start the development server**:

```bash
python manage.py runserver
```

Your application should now be running at `http://127.0.0.1:8000/`.
Here are the API endpoints based on the URL patterns and the error message you've shared:

### Auth Endpoints
- **POST** `/register/` - Register a new user.
- **POST** `/login/` - Login and get JWT token.
- **POST** `/logout/` - Logout and invalidate JWT token.

### User Endpoints
- **GET** `/users/` - List all users.
- **GET** `/users/<user_id>/` - Retrieve a specific user by ID.

### Quiz Endpoints
- **GET** `/quizzes/` - List all quizzes (for authenticated users).
- **POST** `/quizzes/` - Create a new quiz (for professors).
- **GET** `/quizzes/<quiz_id>/` - Retrieve a specific quiz by ID.
- **PUT** `/quizzes/<quiz_id>/` - Update a quiz (for professors).
- **DELETE** `/quizzes/<quiz_id>/` - Delete a quiz (for professors).
- **GET** `/quizzes/<quiz_id>/leaderboard/` - Get the leaderboard for a specific quiz.

### Question Endpoints
- **GET** `/questions/` - List all questions (for authenticated users).
- **POST** `/questions/` - Add a new question (for professors).
- **GET** `/questions/<question_id>/` - Retrieve a specific question by ID.
- **PUT** `/questions/<question_id>/` - Update a question (for professors).
- **DELETE** `/questions/<question_id>/` - Delete a question (for professors).

### UserQuizAttempt Endpoints
- **POST** `/quizzes/<quiz_id>/start/` - Start a quiz attempt.
- **GET** `/quizzes/<quiz_id>/resume/` - Resume a quiz attempt.
- **POST** `/quizzes/<quiz_id>/complete/` - Complete a quiz attempt.
- **POST** `/quizzes/<quiz_id>/submit/` - Submit an answer for a quiz question.

### Silk (Query Profiling) Endpoints
- **GET** `/silk/` - Silk summary page for query profiling.
- **GET** `/silk/requests/` - View all requests.
- **GET** `/silk/request/<request_id>/` - View details of a specific request.
- **GET** `/silk/request/<request_id>/sql/` - View SQL queries for a specific request.
- **GET** `/silk/request/<request_id>/sql/<sql_id>/` - View details of a specific SQL query for a request.
- **GET** `/silk/cleardb/` - Clear the Silk database for profiling.
- **GET** `/silk/request/<request_id>/profiling/` - View profiling data for a request.

### Schema and Docs Endpoints
- **GET** `/api/schema/` - View API schema.
- **GET** `/api/docs/` - Swagger UI for API documentation.
- **GET** `/api/redoc/` - ReDoc UI for API documentation.

### Error Explanation
The error message you're encountering (`silk/reques`) is due to a URL mismatch. It seems like you're trying to access a URL (`/silk/reques`) that doesn't exist in your routing. The correct URL for viewing Silk requests is `/silk/requests/`.

Make sure to access the correct endpoints:

- **Requests**: `/silk/requests/`
- **Request Detail**: `/silk/request/<request_id>/`


