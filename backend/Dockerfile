# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set the working directory in the container
WORKDIR /app

# Copy the dependencies file to the working directory
COPY requirements.txt .


# Install any needed packages specified in requirements.txt with increased timeout and retries
RUN pip install --retries 10 --timeout 1000 --no-cache-dir -r requirements.txt

# Copy the rest of the application's code
COPY . .

# Expose port 8000 to the outside world
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
