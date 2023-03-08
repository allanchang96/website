pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
                // give my init.sh execution functionality
                sh 'chmod +x source/init.sh'
                sh 'rsync -rvp --checksum --rsh=ssh source debian@192.168.1.160:/home/debian/website'
                // TODO: currently broken
                // sh 'ssh debian@192.168.1.160 "/bin/bash -l -c /home/debian/website/source/init.sh"'
            }
        }
    }
}