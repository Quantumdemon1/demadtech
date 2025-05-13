
# Data Mapping Notes

This document outlines the differences between the frontend and backend data models and how they are mapped in the application.

## User/Donor/Political Client Mappings

### Identifier Mapping
- **Backend:** Uses entity-specific GUIDs (`donorGuid`, `politicalClientGuid`)
- **Frontend:** Uses a single `id` field for all entity types

### Authentication Fields
- **Backend:** 
  - Uses `loginUsername` for identification
  - Uses `loginPw` cookie for authentication
- **Frontend:** 
  - Uses `email` or `loginUsername` field
  - Uses `password` field (not stored in User object)

### Name Fields
- **Backend:** 
  - Uses `donorName` for donors
  - Uses `politicalClientName` for political clients
- **Frontend:** 
  - Uses `firstName` + `lastName` for donors
  - Uses `politicalClientName` for political clients

### Role Handling
- **Backend:** No explicit role field, role determined by endpoint used
- **Frontend:** Explicit `role` field with values: `'donor' | 'politicalClient' | 'admin'`

### Profile Fields
- **Frontend** includes fields not explicitly supported by basic backend operations:
  - `phone`
  - `address`
  - `city`
  - `state`
  - `zip`
  - `occupation`
  
  *Note: These fields may require additional API endpoints or backend schema updates to be fully supported.*

## API Authentication

- All API requests require an `accessToken` cookie (value from backend's `DAT_CAMPAIGN_SVC_ACCESS_TOKEN` env var)
- User-specific endpoints additionally require:
  - `loginUsername` as a query parameter
  - `loginPw` cookie for authenticated operations

## Cookie Handling

- The `accessToken` cookie must be set manually during development/testing
- The `loginPw` cookie will be set by authentication logic during login
- All API requests include credentials to ensure cookies are sent

## Environment Configuration

- Backend API base URL configured via `VITE_API_BASE_URL` environment variable
- Default value: `http://localhost:8080/v1`
