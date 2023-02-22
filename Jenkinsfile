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
                sh 'chmod +x source/app.js'
                sh 'rsync -p --rsh=ssh debian@192.168.1.160:~/website source'
                def remote = [:]
                remote.name = '192.168.1.160'
                remote.host = '192.168.1.160'
                remote.user = 'debian'
                remote.allowAnyHosts = true
                remote.identityFile = .ssh/id_ed25519
                sshCommand remote: remote, command: "./source/init.sh"
            }
        }
    }
}