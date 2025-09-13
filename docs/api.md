# ShearBite Auth Service API Documentation

## Overview

The ShearBite Auth Service API provides endpoints for user authentication and donation management. It supports user registration, login, token refresh, and CRUD operations for donations. This API follows the OpenAPI 3.1.0 specification and uses OAuth2 for secure access to protected endpoints.

## Base Information

- **Title:** ShearBite Auth Service
- **Version:** 0.1.0
- **Base URL:** (To be provided by the deployment environment)

## Authentication

The API uses OAuth2 Password Bearer for authentication. Protected endpoints require a valid access token obtained via the `/auth/login` endpoint. The token must be included in the `Authorization` header as `Bearer <token>`.

### Security Scheme

- **Type:** OAuth2
- **Flow:** Password
- **Token URL:** `/auth/login`

## Endpoints

### 1. Authentication Endpoints

#### POST /auth/register

Register a new user.

- **Summary:** Register
- **Operation ID:** `register_auth_register_post`
- **Request Body:**
  ```json
  {
    "email": "string (email format)",
    "password": "string"
  }
  ```
- **Responses:**
  - **200:** Successful registration
    ```json
    {
      "email": "string (email format)",
      "id": "integer",
      "is_active": "boolean"
    }
    ```
  - **422:** Validation Error
    ```json
    {
      "detail": [
        {
          "loc": ["string", "integer"],
          "msg": "string",
          "type": "string"
        }
      ]
    }
    ```

#### POST /auth/login

Authenticate a user and obtain an access token.

- **Summary:** Login
- **Operation ID:** `login_auth_login_post`
- **Request Body:**
  ```json
  {
    "email": "string (email format)",
    "password": "string"
  }
  ```
- **Responses:**
  - **200:** Successful login (returns access token)
    ```json
    {}
    ```
  - **422:** Validation Error
    ```json
    {
      "detail": [
        {
          "loc": ["string", "integer"],
          "msg": "string",
          "type": "string"
        }
      ]
    }
    ```

#### POST /auth/refresh

Refresh an access token using a refresh token.

- **Summary:** Refresh
- **Operation ID:** `refresh_auth_refresh_post`
- **Parameters:**
  - `refresh_token` (cookie, optional): `string`
- **Responses:**
  - **200:** Successful token refresh
    ```json
    {}
    ```
  - **422:** Validation Error
    ```json
    {
      "detail": [
        {
          "loc": ["string", "integer"],
          "msg": "string",
          "type": "string"
        }
      ]
    }
    ```

### 2. Donation Endpoints

All donation endpoints require authentication via OAuth2 Password Bearer.

#### POST /donations/

Create a new donation.

- **Summary:** Create Donation
- **Description:** Create a new donation entry.
- **Operation ID:** `create_donation_donations__post`
- **Request Body:**
  ```json
  {
    "food_item": "string",
    "description": "string | null",
    "quantity": "string",
    "images": ["string (URI format, max length 2083)"] | null,
    "pickup_location_lat": "number",
    "pickup_location_lon": "number",
    "preferred_pickup_time": "string | null",
    "expiration_date": "string (date-time) | null",
    "allergens": ["string"] | null,
    "is_perishable": "boolean (default: false)"
  }
  ```
- **Responses:**
  - **200:** Successful creation
    ```json
    {
      "food_item": "string",
      "description": "string | null",
      "quantity": "string",
      "images": ["string"] | null,
      "pickup_location_lat": "number",
      "pickup_location_lon": "number",
      "preferred_pickup_time": "string | null",
      "expiration_date": "string (date-time) | null",
      "allergens": ["string"] | null,
      "is_perishable": "boolean",
      "id": "integer",
      "donor_id": "integer",
      "claimant_id": "integer | null",
      "status": "string",
      "created_at": "string (date-time)",
      "updated_at": "string (date-time) | null"
    }
    ```
  - **422:** Validation Error
    ```json
    {
      "detail": [
        {
          "loc": ["string", "integer"],
          "msg": "string",
          "type": "string"
        }
      ]
    }
    ```

#### GET /donations/

Retrieve a list of donations.

- **Summary:** Read Donations
- **Description:** Retrieve a paginated list of donations.
- **Operation ID:** `read_donations_donations__get`
- **Parameters:**
  - `skip` (query, optional): `integer` (default: 0)
  - `limit` (query, optional): `integer` (default: 100)
- **Responses:**
  - **200:** Successful response
    ```json
    [
      {
        "food_item": "string",
        "description": "string | null",
        "quantity": "string",
        "images": ["string"] | null,
        "pickup_location_lat": "number",
        "pickup_location_lon": "number",
        "preferred_pickup_time": "string | null",
        "expiration_date": "string (date-time) | null",
        "allergens": ["string"] | null,
        "is_perishable": "boolean",
        "id": "integer",
        "donor_id": "integer",
        "claimant_id": "integer | null",
        "status": "string",
        "created_at": "string (date-time)",
        "updated_at": "string (date-time) | null"
      }
    ]
    ```
  - **422:** Validation Error
    ```json
    {
      "detail": [
        {
          "loc": ["string", "integer"],
          "msg": "string",
          "type": "string"
        }
      ]
    }
    ```

#### GET /donations/{donation_id}

Retrieve a donation by ID.

- **Summary:** Read Donation
- **Description:** Get a specific donation by its ID.
- **Operation ID:** `read_donation_donations__donation_id__get`
- **Parameters:**
  - `donation_id` (path, required): `integer`
- **Responses:**
  - **200:** Successful response
    ```json
    {
      "food_item": "string",
      "description": "string | null",
      "quantity": "string",
      "images": ["string"] | null,
      "pickup_location_lat": "number",
      "pickup_location_lon": "number",
      "preferred_pickup_time": "string | null",
      "expiration_date": "string (date-time) | null",
      "allergens": ["string"] | null,
      "is_perishable": "boolean",
      "id": "integer",
      "donor_id": "integer",
      "claimant_id": "integer | null",
      "status": "string",
      "created_at": "string (date-time)",
      "updated_at": "string (date-time) | null"
    }
    ```
  - **422:** Validation Error
    ```json
    {
      "detail": [
        {
          "loc": ["string", "integer"],
          "msg": "string",
          "type": "string"
        }
      ]
    }
    ```

#### PUT /donations/{donation_id}

Update a donation.

- **Summary:** Update Donation
- **Description:** Update an existing donation by its ID.
- **Operation ID:** `update_donation_donations__donation_id__put`
- **Parameters:**
  - `donation_id` (path, required): `integer`
- **Request Body:**
  ```json
  {
    "food_item": "string",
    "description": "string | null",
    "quantity": "string",
    "images": ["string (URI format, max length 2083)"] | null,
    "pickup_location_lat": "number",
    "pickup_location_lon": "number",
    "preferred_pickup_time": "string | null",
    "expiration_date": "string (date-time) | null",
    "allergens": ["string"] | null,
    "is_perishable": "boolean (default: false)",
    "status": "string | null"
  }
  ```
- **Responses:**
  - **200:** Successful update
    ```json
    {
      "food_item": "string",
      "description": "string | null",
      "quantity": "string",
      "images": ["string"] | null,
      "pickup_location_lat": "number",
      "pickup_location_lon": "number",
      "preferred_pickup_time": "string | null",
      "expiration_date": "string (date-time) | null",
      "allergens": ["string"] | null,
      "is_perishable": "boolean",
      "id": "integer",
      "donor_id": "integer",
      "claimant_id": "integer | null",
      "status": "string",
      "created_at": "string (date-time)",
      "updated_at": "string (date-time) | null"
    }
    ```
  - **422:** Validation Error
    ```json
    {
      "detail": [
        {
          "loc": ["string", "integer"],
          "msg": "string",
          "type": "string"
        }
      ]
    }
    ```

#### DELETE /donations/{donation_id}

Delete a donation.

- **Summary:** Delete Donation
- **Description:** Delete a donation by its ID.
- **Operation ID:** `delete_donation_donations__donation_id__delete`
- **Parameters:**
  - `donation_id` (path, required): `integer`
- **Responses:**
  - **200:** Successful deletion
    ```json
    {
      "food_item": "string",
      "description": "string | null",
      "quantity": "string",
      "images": ["string"] | null,
      "pickup_location_lat": "number",
      "pickup_location_lon": "number",
      "preferred_pickup_time": "string | null",
      "expiration_date": "string (date-time) | null",
      "allergens": ["string"] | null,
      "is_perishable": "boolean",
      "id": "integer",
      "donor_id": "integer",
      "claimant_id": "integer | null",
      "status": "string",
      "created_at": "string (date-time)",
      "updated_at": "string (date-time) | null"
    }
    ```
  - **422:** Validation Error
    ```json
    {
      "detail": [
        {
          "loc": ["string", "integer"],
          "msg": "string",
          "type": "string"
        }
      ]
    }
    ```

#### POST /donations/{donation_id}/claim

Claim a donation.

- **Summary:** Claim Donation
- **Description:** Claim a donation by its ID.
- **Operation ID:** `claim_donation_donations__donation_id__claim_post`
- **Parameters:**
  - `donation_id` (path, required): `integer`
- **Responses:**
  - **200:** Successful claim
    ```json
    {
      "food_item": "string",
      "description": "string | null",
      "quantity": "string",
      "images": ["string"] | null,
      "pickup_location_lat": "number",
      "pickup_location_lon": "number",
      "preferred_pickup_time": "string | null",
      "expiration_date": "string (date-time) | null",
      "allergens": ["string"] | null,
      "is_perishable": "boolean",
      "id": "integer",
      "donor_id": "integer",
      "claimant_id": "integer | null",
      "status": "string",
      "created_at": "string (date-time)",
      "updated_at": "string (date-time) | null"
    }
    ```
  - **422:** Validation Error
    ```json
    {
      "detail": [
        {
          "loc": ["string", "integer"],
          "msg": "string",
          "type": "string"
        }
      ]
    }
    ```

## Schemas

### Donation

Represents a donation entry.

```json
{
  "food_item": "string",
  "description": "string | null",
  "quantity": "string",
  "images": ["string (URI, max length 2083)"] | null,
  "pickup_location_lat": "number",
  "pickup_location_lon": "number",
  "preferred_pickup_time": "string | null",
  "expiration_date": "string (date-time) | null",
  "allergens": ["string"] | null,
  "is_perishable": "boolean (default: false)",
  "id": "integer",
  "donor_id": "integer",
  "claimant_id": "integer | null",
  "status": "string",
  "created_at": "string (date-time)",
  "updated_at": "string (date-time) | null"
}
```

### DonationCreate

Schema for creating a donation.

```json
{
  "food_item": "string",
  "description": "string | null",
  "quantity": "string",
  "images": ["string (URI, max length 2083)"] | null,
  "pickup_location_lat": "number",
  "pickup_location_lon": "number",
  "preferred_pickup_time": "string | null",
  "expiration_date": "string (date-time) | null",
  "allergens": ["string"] | null,
  "is_perishable": "boolean (default: false)"
}
```

### DonationUpdate

Schema for updating a donation.

```json
{
  "food_item": "string",
  "description": "string | null",
  "quantity": "string",
  "images": ["string (URI, max length 2083)"] | null,
  "pickup_location_lat": "number",
  "pickup_location_lon": "number",
  "preferred_pickup_time": "string | null",
  "expiration_date": "string (date-time) | null",
  "allergens": ["string"] | null,
  "is_perishable": "boolean (default: false)",
  "status": "string | null"
}
```

### UserCreate

Schema for user registration.

```json
{
  "email": "string (email format)",
  "password": "string"
}
```

### UserLogin

Schema for user login.

```json
{
  "email": "string (email format)",
  "password": "string"
}
```

### UserOut

Schema for user response after registration.

```json
{
  "email": "string (email format)",
  "id": "integer",
  "is_active": "boolean"
}
```

### HTTPValidationError

Schema for validation errors.

```json
{
  "detail": [
    {
      "loc": ["string", "integer"],
      "msg": "string",
      "type": "string"
    }
  ]
}
```

### ValidationError

Schema for individual validation error details.

```json
{
  "loc": ["string", "integer"],
  "msg": "string",
  "type": "string"
}
```

## Usage Examples

### Register a User

```bash
curl -X POST "BASE_URL/auth/register" \
-H "Content-Type: application/json" \
-d '{"email": "user@example.com", "password": "securepassword"}'
```

### Login

```bash
curl -X POST "BASE_URL/auth/login" \
-H "Content-Type: application/json" \
-d '{"email": "user@example.com", "password": "securepassword"}'
```

### Create a Donation

```bash
curl -X POST "BASE_URL/donations/" \
-H "Authorization: Bearer <access_token>" \
-H "Content-Type: application/json" \
-d '{
  "food_item": "Apples",
  "description": "Fresh apples",
  "quantity": "10 kg",
  "pickup_location_lat": 37.7749,
  "pickup_location_lon": -122.4194,
  "is_perishable": true
}'
```

### Retrieve Donations

```bash
curl -X GET "BASE_URL/donations/?skip=0&limit=10" \
-H "Authorization: Bearer <access_token>"
```

## Error Handling

- **422 Validation Error:** Returned when request data does not match the expected schema. The response includes details about the validation errors, including the location (`loc`), message (`msg`), and error type (`type`).

## Notes

- Ensure all required fields are provided in requests to avoid validation errors.
- Use the access token obtained from `/auth/login` for all protected endpoints.
- For further details on xAI's API services, visit [xAI API](https://xai.com).
