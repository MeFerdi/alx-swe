pipeline {
    agent any

    environment {
        dockerImage = ''
    }

    stages {
        stage('Clone Repository') {
            steps {
                // Clone the repository from GitHub
                git 'https://github.com/yourusername/groupie-tracker.git' // Replace with your repo URL
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    dockerImage = docker.build("groupie-tracker:latest")
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Run tests inside the Docker container (adjust command as necessary)
                    sh "docker run --rm ${dockerImage} ./run-tests.sh" // Adjust based on how you run tests
                }
            }
        }

        stage('Cleanup') {
            steps {
                script {
                    // Optionally remove local images after testing
                    sh "docker rmi groupie-tracker:latest"
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
