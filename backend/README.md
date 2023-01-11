# Automate process of uploading apps to IEM/IED with Angular application.


- [User Interface implemented with Angular](#user-interface-implemented-with-angular)
  - [Description](#description)
    - [Overview](#overview)
    - [General task](#general-task)
  - [Requirements](#requirements)
    - [Prerequisites](#prerequisites)
    - [Used components](#used-components)
  - [Overview of Application function](#overview-of-application-function)

## Description

###  Overview
The application facilitate the deploying of a dockerised node-red application/flow creator to the Industrial Edge Management 

Note: Further to implement fetching latest flow from the IED and deploy it as a new application in IEM

### General task

The main goal of this application is to provide an easy to use interface for a user to upload an application to the Industrial Edge management and also to fetch current flow running in an Industrial Edge Device and to deploy the latest flow as an docker-application to the IEM. 

## Requirements

###  Prerequisites

- Linux VM with docker and docker-compose installed
- VM has connection to IEM 
- Installed Industrial Edge Management
- Pre-existing project folder created in Industrial Edge Management
- Built image of the docker node-red application in system

### Used components

- Industrial Edge Device 
- Industrial Edge Management 
- VM - Ubuntu 20.04
- Docker 20.10.
- Angular CLI 14.2.8
- Nodejs

## Overview of Application function


- The application login to the IEM with users credentials.
- Fetches the detail of the existing projects folder in the IEM (if not user must create a project in the IEM)
- User can upload the docker-compose-file (.yml) to deploy to the Industrial Edge Management
- Make sure the docker-image to upload to the IEM is build in system
- User can upload a pre-defined flow.json file to run as application in the Industrial Edge Device
- On Trigger the docker aplication is deployed to the IEM


## Documentation

