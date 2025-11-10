# Bell Cart API

## Overview

This project implements a **thin Experience API** for a telecom cart on top of a **non-persistent Salesforce cart context**.
It allows creating carts, adding/updating/removing items, and retrieving carts. Salesforce integration is **mocked** for testing purposes.

The project is written in **Node.js 20+ with TypeScript** using **Express**.
No database is used, all data is kept in-memory.

---

## Table of Contents

- [Architecture](#architecture)
- [Setup](#setup)
- [Running the App](#running-the-app)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Decisions & Tradeoffs](#decisions--tradeoffs)
- [Known Gaps](#known-gaps)

---

## Architecture

### Components

1. **CartStore (`src/store/cartStore.ts`)**
   - In-memory storage (`Map<string, CartContext>`).
   - Handles create, get, update, delete operations.
   - Expiry (`expiresAt`) implemented with TTL.

2. **CartService (`src/service/cartService.ts`)**
   - Logic for cart operations.
   - Validates item data, manages updates/removals.

3. **SalesforceCartClient (`src/salesforce/salesforceCartClient.ts`)**
   - Mock of Salesforce cart context with TTL (default 2 minutes).
   - Simulates Salesforce behavior without real API calls.

4. **Express Router (`src/routes/cartRoutes.ts`)**
   - Exposes REST endpoints for carts and items.  
   - Integrates `CartStore`, `CartService`, and `SalesforceCartClient`.

---

## Setup

### 1. Install Dependencies

Install the required runtime and development dependencies:

```bash
npm install
```

### 2. Run App in Development

```bash
npm run dev
```

### 3. Tests

Run Tests

```bash
npx jest
```

---

## Running the App

After running `npm run dev`, the server will be available at `http://localhost:9000`.

---

## API Endpoints

#### 1. Create a Cart (POST /cart)
**Response:**
```json
{
  "cartId": "uuid",
  "sfContextId": "uuid",
  "expiresAt": 123456
}
```

#### 2. Get Cart (GET /cart/:id)
**Response:**
```json
{
  "id": "uuid",
  "items": [],
  "expiresAt": 123456
}
```

### Additional Endpoints
- POST /cart/:id/items
- PATCH /cart/:id/items/:itemId
- DELETE /cart/:id/items/:itemId

---

## Testing

The project uses **Jest + Supertest** to test critical API endpoints.  
Tests cover cart creation, retrieval, item operations, and cart expiration.

### Run Tests

```bash
npx jest
```

### Few Tested Endpoints e.g.

#### 1. Create Cart
- Verifies a new cart can be created.
- Checks that `cartId` and `sfContextId` are returned.

#### 2. Get Cart
- Retrieves the created cart by ID.
- Confirms the `items` array is empty initially.

---

## **Decisions & Tradeoffs**

- Node + TypeScript for type safety
- Express for minimal overhead
- In-memory store for simplicity (MAP)
- Salesforce mock with TTL instead of real API

---

## **Known Gaps / Limitations**

- No authentication
- No real Salesforce integration
- Minimal error handling/logging
- No frontend layer

---
