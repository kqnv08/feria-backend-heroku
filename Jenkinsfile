pipeline {
    agent any

    environment {
        //registryAWS = 'https://569820981820.dkr.ecr.us-east-1.amazonaws.com'
        registryAWS = '569820981820.dkr.ecr.us-east-1.amazonaws.com'
        registryID = 'ecr:us-east-1:57f15665-3b10-4f2c-a510-c08faf61c984'
        dockerImageStaging = ''
        repositoryNameStaging = 'kayak-kpm-api-staging'
        dockerImageStagingClient = ''
        repositoryNameStagingClient = 'kayak-kpm-api-staging-client'
        gitCommit_2 = ''
    }

    stages {

        stage('Clone repository') {
        /* Cloning the Repository to our Workspace */
            steps {
                checkout scm
                script {
                    gitCommit_2 = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
                    echo "GIT_COMMIT_2 is ${gitCommit_2}"
                    echo "GIT_COMMIT_2 is ${env.gitCommit_2}"
                }
            }
        }

        stage('Start Notification') {
            steps {
                slackSend botUser: true,
                          channel: '#_jenkins',
                          iconEmoji: ':beers:',
                          color: '#439FE0',
                          message: "Start Pipeline: ${env.JOB_NAME}\n By: ${env.CHANGE_AUTHOR_DISPLAY_NAME}\n Console Log Status: ${env.BUILD_URL}/console",
                          tokenCredentialId: 'jenkins-bot'
            }
        }
        stage('Variables') {
            steps {
                echo "Running ${env.BUILD_ID} on ${env.JENKINS_URL}"
                echo "Running ${env.JOB_NAME} on ${env.JOB_BASE_NAME}"
                echo "GIT_COMMIT is ${env.GIT_COMMIT}"
            }
        }


        stage('Build image staging') {
            when {
                branch 'staging'
            }
            environment {
               DOCKER_BUILDKIT='1'
            }
             steps {
                echo '*************************'
                echo 'Starting to build docker image'
                echo '*************************'
                script {
                    dockerImageStaging = docker.build("${env.registryAWS}/${env.repositoryNameStaging}:${env.GIT_COMMIT}")
                 }
             }
        }

        stage('Build image staging client') {
            when {
                branch 'production'
            }
            environment {
               DOCKER_BUILDKIT='1'
            }
             steps {
                echo '*************************'
                echo 'Starting to build docker image'
                echo '*************************'
                script {
                    dockerImageStagingClient = docker.build("${env.registryAWS}/${env.repositoryNameStagingClient}:${env.GIT_COMMIT}")
                 }
             }
        }


        stage('Test Image') {
            steps {
              echo "Test Passed"
            }
        }

        stage('Create repository AWS') {
            steps {
                sh "aws ecr describe-repositories --repository-names ${env.repositoryNameStaging} || aws ecr create-repository --repository-name ${env.repositoryNameStaging}"
                sh "aws ecr describe-repositories --repository-names ${env.repositoryNameStagingClient} || aws ecr create-repository --repository-name ${env.repositoryNameStagingClient}"
            }
        }

        stage('Push image Staging') {
            when {
                branch 'staging'
            }
            steps {
                echo '*************************'
                echo 'Push to AWS ECR Registry'
                echo '*************************'
                script {
                    docker.withRegistry("https://${env.registryAWS}", registryID) {
                        dockerImageStaging.push("${env.GIT_COMMIT}")
                        dockerImageStaging.push("latest")
                    }
                }
            }
        }

        stage('Push image Staging Client') {
            when {
                branch 'production'
            }
            steps {
                echo '*************************'
                echo 'Push to AWS ECR Registry'
                echo '*************************'
                script {
                    docker.withRegistry("https://${env.registryAWS}", registryID) {
                        dockerImageStagingClient.push("${env.GIT_COMMIT}")
                        dockerImageStagingClient.push("latest")
                    }
                }
            }
        }

        stage('Remove Image Staging') {
            when {
                branch 'staging'
            }
            steps {
                echo '*************************'
                echo 'Removed local image'
                echo '*************************'
                sh "docker rmi $registryAWS/$repositoryNameStaging:$GIT_COMMIT"
                sh "docker rmi $registryAWS/$repositoryNameStaging:latest"
            }
        }

        stage('Remove Image Staging Client') {
            when {
                branch 'production'
            }
            steps {
                echo '*************************'
                echo 'Removed local image'
                echo '*************************'
                sh "docker rmi $registryAWS/$repositoryNameStagingClient:$GIT_COMMIT"
                sh "docker rmi $registryAWS/$repositoryNameStagingClient:latest"
            }
        }
        stage('Deploy Staging') {
            when {
                branch 'staging'
            }
            steps {
                sshPublisher(publishers:
                    [sshPublisherDesc(configName: 'Amazon-Staging', transfers: [sshTransfer(cleanRemote: false, excludes: '',
                    execCommand: """
                                  docker system prune -a --force
                                  cd /home/silentium/deployer-staging/kayak-kpm
                                  chmod u+x deploy-api.sh
                                  sh deploy-api.sh $GIT_COMMIT
                                 """,
                    execTimeout: 3000000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '',
                    remoteDirectorySDF: false, removePrefix: '', sourceFiles: '')],
                    usePromotionTimestamp: false,
                    useWorkspaceInPromotion: false,
                    verbose: true)])
            }
        }

        stage('Deploy Staging Client') {
            when {
                branch 'production'
            }
            steps {
                sshPublisher(publishers:
                    [sshPublisherDesc(configName: 'the-kayak-client-staging', transfers: [sshTransfer(cleanRemote: false, excludes: '',
                    execCommand: """
                                  docker system prune -a --force
                                  cd /home/ubuntu/deployer-staging
                                  chmod u+x deploy-api.sh
                                  sh deploy-api.sh $GIT_COMMIT
                                 """,
                    execTimeout: 3000000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: '',
                    remoteDirectorySDF: false, removePrefix: '', sourceFiles: '')],
                    usePromotionTimestamp: false,
                    useWorkspaceInPromotion: false,
                    verbose: true)])
            }
        }
    }

    post {
        always {
            echo 'One way or another, I have finished'
            /* deleteDir()  clean up our workspace */
        }
        success {
            slackSend botUser: true,
                channel: '#_jenkins',
                iconEmoji: ':beers:',
                color: 'good',
                message: "Job:  ${env.JOB_NAME}\n Status: *SUCCESS*\n URL Staging: kayak-kpm-api.staging.silentiumapps.com\n URL Prod: kayak-kpm-api.staging.kayakpoolsmidwest.com",
                tokenCredentialId: 'jenkins-bot'
        }
        unstable {
            slackSend botUser: true,
                channel: '#_jenkins',
                iconEmoji: ':beers:',
                color: 'warning',
                message: "Job:  ${env.JOB_NAME}\n Status: *UNSTABLE*\n Console Log: ${env.BUILD_URL}/console",
                tokenCredentialId: 'jenkins-bot'
        }
        failure {
            slackSend botUser: true,
                channel: '#_jenkins',
                iconEmoji: ':beers:',
                color: 'danger',
                message: "Job:  ${env.JOB_NAME}\n Status: *FAILED*\n Console Log: ${env.BUILD_URL}/console",
                tokenCredentialId: 'jenkins-bot'
        }
        aborted {
            slackSend botUser: true,
                channel: '#_jenkins',
                iconEmoji: ':beers:',
                color: 'danger',
                message: "Job:  ${env.JOB_NAME}\n Status: *ABORTED*\n Console Log: ${env.BUILD_URL}/console",
                tokenCredentialId: 'jenkins-bot'
        }
    }
}