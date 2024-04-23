# Charger API Documentation

This repository contains the Charger API, an application for managing charger devices. It includes full CRUD operations and is deployed via AWS CDK.

## Prerequisites

Before you begin, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or later)
- [AWS CLI](https://aws.amazon.com/cli/)
- [AWS CDK Toolkit](https://docs.aws.amazon.com/cdk/latest/guide/cli.html)

## Setup AWS CDK Credentials

To deploy the application using AWS CDK, you need to configure your AWS credentials. Follow these steps:

1. **Configure AWS CLI**:
   Run `aws configure` and enter your AWS Access Key ID, Secret Access Key, region, and output format as required.

2. **Bootstrap CDK**:
   If this is your first time using CDK in the region, you need to bootstrap AWS CDK using:
   ```bash
   cdk bootstrap

## Deploying the CDK Application

To deploy the Charger API

1. **Navigate to the project directory:**
  ```bash
  cd path/to/your/project

2. **Install dependencies:**
  ```bash
  npm install

3. **Deploy the stack:**
  ```bash
  cdk deploy
  ```

## Testing the Public Endpoints

### Note my public endpoint for testing is `https://0trws66xs2.execute-api.us-east-2.amazonaws.com/prod/`

The public GET endpoints can be tested without authentication.

- **List All Chargers**:
  ```bash
curl https://yourapi.domain.com/prod/chargers
  ```

- **Get Charger by ID:**
  ```bash
curl https://yourapi.domain.com/prod/chargers/{id}
  ```

Replace {id} with the actual ID of the charger you wish to retrieve.

## Secure Endpoints

The following endpoints require an API key for access:

- **Create a Charger**:
  ```bash
curl -X POST https://yourapi.domain.com/prod/chargers \
    -H 'x-api-key: HXIi0fZz5l6oivOcp0H0t4D4Hczc1vDe2nlGw3PV' \
    -H 'Content-Type: application/json' \
    -d '{"name": "New Charger", "description": "Fast charging solution", "status": "active", "location": {"latitude": 34.0522, "longitude": -118.2437}, "networkProtocol": "OCPP", "publicVisibility": true}'
  ```

- **Update a Charger:**
  ```bash
curl -X PUT https://yourapi.domain.com/prod/chargers/{id} \
    -H 'x-api-key: HXIi0fZz5l6oivOcp0H0t4D4Hczc1vDe2nlGw3PV' \
    -H 'Content-Type: application/json' \
    -d '{"name": "Updated Charger", "description": "Updated description", "status": "active", "location": {"latitude": 34.0522, "longitude": -118.2437}, "networkProtocol": "OCPP", "publicVisibility": true}'
  ```

- **Delete a Charger:**
  ```bash
curl -X DELETE https://yourapi.domain.com/prod/chargers/{id} \
    -H 'x-api-key: HXIi0fZz5l6oivOcp0H0t4D4Hczc1vDe2nlGw3PV'
  ```


Replace {id} with the charger ID you intend to update or delete. Note that if you are planning to deploy your own version, your API key will be different that the one provided above.

## Additional Information
For more detailed API documentation, refer to the Swagger (OpenAPI) specs located at /charger-api.yaml in this repository.


### Notes

- This `README.md` provides a clear guide on how to configure, deploy, and interact with your API.
- Ensure you update the URLs and other placeholders (`https://yourapi.domain.com/prod/chargers`) with actual values relevant to your deployment.
- Adjust the example commands according to the specific requirements and configurations of your API.
