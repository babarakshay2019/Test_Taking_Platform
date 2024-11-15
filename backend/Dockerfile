# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app/

# Install system dependencies and clean up after to reduce image size
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip to the latest version
RUN pip install --upgrade pip

# Install dependencies from requirements.txt
RUN pip install -r requirements.txt

# Expose the port the app runs on
EXPOSE 8000

# Set environment variables for Django settings (e.g., disable Django debug mode in production)
ENV DJANGO_SETTINGS_MODULE=Test_Taking_Platform.settings
ENV PYTHONUNBUFFERED 1

# Apply migrations and create a superuser if needed
RUN python manage.py migrate

# Command to run the application
CMD ["gunicorn", "Test_Taking_Platform.wsgi:application", "--bind", "0.0.0.0:8000"]
