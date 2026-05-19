# GenAISAP API Documentation

## Overview

GenAISAP provides a comprehensive REST API for SAP S/4HANA integration with real-time capabilities, multi-tenant support, and enterprise-grade security.

## Base URL

```
https://your-domain.com/api
```

## Authentication

All API endpoints (except `/api/health`) require authentication via Bearer token.

### Getting Your Token

1. Login via `/api/auth/login`
2. Extract the `session` token from the response
3. Include in the `Authorization` header:

```
Authorization: Bearer your_token_here
```

## API Endpoints

### Authentication

#### POST /api/auth/login
Authenticate user and return session token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "user_metadata": {
        "tenant_id": "default"
      }
    },
    "session": {
      "access_token": "jwt_token_here",
      "expires_at": "2026-05-09T10:00:00Z"
    }
  },
  "timestamp": "2026-05-08T12:00:00Z"
}
```

#### POST /api/auth/logout
Invalidate user session.

**Headers:**
```
Authorization: Bearer your_token_here
```

**Response:**
```json
{
  "success": true,
  "timestamp": "2026-05-08T12:00:00Z"
}
```

### User Management

#### GET /api/user/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer your_token_here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "uuid",
      "tenant_id": "default",
      "full_name": "John Doe",
      "avatar_url": "https://example.com/avatar.jpg",
      "bio": "SAP consultant",
      "role": "user",
      "created_at": "2026-01-01T00:00:00Z",
      "updated_at": "2026-05-08T12:00:00Z"
    }
  },
  "timestamp": "2026-05-08T12:00:00Z"
}
```

#### PUT /api/user/profile
Update user profile.

**Headers:**
```
Authorization: Bearer your_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg",
  "bio": "Updated bio"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "uuid",
      "tenant_id": "default",
      "full_name": "John Doe",
      "avatar_url": "https://example.com/avatar.jpg",
      "bio": "Updated bio",
      "updated_at": "2026-05-08T12:00:00Z"
    }
  },
  "timestamp": "2026-05-08T12:00:00Z"
}
```

### Dashboard

#### GET /api/dashboard/metrics
Get dashboard metrics and KPIs.

**Headers:**
```
Authorization: Bearer your_token_here
```

**Response:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "revenue_mtd": "$2,847,392",
      "revenue_trend": "+12.4%",
      "open_pos": 47,
      "dso": "42.3 days",
      "dso_trend": "-3.2%",
      "system_health": "99.98%",
      "active_users": 247,
      "api_calls": 1429,
      "data_sync": "Live"
    }
  },
  "timestamp": "2026-05-08T12:00:00Z"
}
```

### Chat

#### POST /api/chat
Send a message and get AI response (streaming).

**Headers:**
```
Authorization: Bearer your_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What are our current Q2 revenues?"
    },
    {
      "role": "assistant", 
      "content": "I'll analyze your Q2 revenue data..."
    }
  ]
}
```

**Response (Streaming):**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

0:"{\"type\":\"message\",\"data\":{\"role\":\"assistant\",\"content\":\"Based on your SAP data...\"}}"
0:"{\"type\":\"message\",\"data\":{\"role\":\"assistant\",\"content\":\"I can see that Q2 revenues...\"}}"
...
0:"{\"type\":\"done\"}"
```

#### GET /api/chat
Get chat history.

**Headers:**
```
Authorization: Bearer your_token_here
```

**Query Parameters:**
- `limit` (optional): Number of messages to return (default: 50)
- `offset` (optional): Number of messages to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "message": "What are our current Q2 revenues?",
        "role": "user",
        "created_at": "2026-05-08T10:00:00Z"
      },
      {
        "id": "uuid",
        "user_id": "uuid",
        "message": "Based on your SAP data, your Q2 revenues show...",
        "role": "assistant",
        "created_at": "2026-05-08T10:00:01Z"
      }
    ]
  },
  "timestamp": "2026-05-08T12:00:00Z"
}
```

### System

#### GET /api/health
Get system health status and metrics.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-05-08T12:00:00Z",
    "uptime": 86400,
    "version": "1.0.0",
    "environment": "production",
    "services": {
      "database": {
        "status": "healthy",
        "responseTime": 45
      },
      "redis": {
        "status": "healthy",
        "responseTime": 12
      },
      "queue": {
        "status": "healthy",
        "queues": [
          {
            "name": "report-generation",
            "status": "active",
            "pending": 3
          },
          {
            "name": "data-sync",
            "status": "active",
            "pending": 1
          },
          {
            "name": "notifications",
            "status": "active",
            "pending": 0
          }
        ]
      }
    },
    "system": {
      "memory": {
        "used": 256,
        "total": 512,
        "percentage": 50
      },
      "cpu": {
        "usage": 15.5,
        "cores": 4
      }
    },
    "endpoints": [
      "/api/health",
      "/api/auth/login",
      "/api/auth/logout",
      "/api/user/profile",
      "/api/dashboard/metrics",
      "/api/chat"
    ]
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  },
  "timestamp": "2026-05-08T12:00:00Z"
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `AUTHENTICATION_ERROR` | 401 | Authentication failed |
| `AUTHORIZATION_ERROR` | 403 | Access denied |
| `NOT_FOUND_ERROR` | 404 | Resource not found |
| `CONFLICT_ERROR` | 409 | Resource conflict |
| `RATE_LIMIT_ERROR` | 429 | Rate limit exceeded |
| `DATABASE_ERROR` | 500 | Database operation failed |
| `EXTERNAL_SERVICE_ERROR` | 502 | External service error |
| `INTERNAL_ERROR` | 500 | Internal server error |

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints:** 20 requests per 15 minutes
- **User profile:** 50 requests per minute
- **Dashboard metrics:** 30 requests per minute
- **Chat endpoints:** 20 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1650000000
```

## Real-time Features

### WebSocket Connections

For real-time updates, connect to WebSocket:

```javascript
const socket = io('wss://your-domain.com', {
  auth: {
    token: 'your_bearer_token'
  }
});

// Events
socket.on('dashboard_update', (data) => {
  // Real-time dashboard updates
});

socket.on('new_message', (data) => {
  // Real-time chat messages
});

socket.on('job_update', (data) => {
  // Real-time job status updates
});
```

### Real-time Events

| Event | Description | Data |
|-------|-------------|------|
| `dashboard_update` | Dashboard metrics updated | Metrics object |
| `new_message` | New chat message | Message object |
| `job_update` | Job status update | Job status object |
| `system_alert` | System alert | Alert object |

## Multi-tenant Support

All data is isolated by tenant using Row Level Security (RLS):

- **Tenant ID:** Stored in user metadata (`user.user_metadata.tenant_id`)
- **Data Isolation:** Each tenant can only access their own data
- **Security:** RLS policies enforce data isolation at database level
- **Scalability:** Supports unlimited tenants with proper performance

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @gensap/api-client
```

```typescript
import { GenAISAPClient } from '@gensap/api-client';

const client = new GenAISAPClient({
  baseURL: 'https://your-domain.com/api',
  token: 'your_token_here'
});

// Get dashboard metrics
const metrics = await client.dashboard.getMetrics();

// Send chat message
const response = await client.chat.sendMessage({
  message: 'What are our Q2 revenues?',
  onStream: (chunk) => {
    console.log('Streaming response:', chunk);
  }
});
```

### Python

```bash
pip install gensap-api-client
```

```python
from gensap_api_client import GenAISAPClient

client = GenAISAPClient(
    base_url='https://your-domain.com/api',
    token='your_token_here'
)

# Get dashboard metrics
metrics = client.dashboard.get_metrics()

# Send chat message
response = client.chat.send_message(
    message='What are our Q2 revenues?',
    stream=True
)
```

## Security

### Authentication

- **JWT Tokens:** Short-lived access tokens (15 minutes)
- **Refresh Tokens:** Automatic token refresh
- **Secure Storage:** Encrypted token storage
- **Multi-factor:** Optional 2FA support

### Data Protection

- **Encryption:** All sensitive data encrypted at rest
- **HTTPS Only:** All API calls require HTTPS
- **Input Validation:** All inputs validated and sanitized
- **SQL Injection:** Parameterized queries prevent SQL injection

### Compliance

- **GDPR:** Data protection and privacy controls
- **SOC 2:** Security controls and monitoring
- **ISO 27001:** Information security management

## Monitoring and Analytics

### Performance Metrics

The system automatically tracks:

- **Response Times:** API endpoint performance
- **Error Rates:** Failed request tracking
- **Usage Patterns:** API usage analytics
- **System Health:** Memory, CPU, and database metrics

### Logging

Comprehensive logging for:

- **Security Events:** Login attempts, access denials
- **Performance:** Slow queries, high latency
- **Business Events:** Report generation, data syncs
- **System Events:** Errors, warnings, health checks

## Support

### Documentation

- **API Reference:** Complete endpoint documentation
- **SDK Guides:** Integration examples
- **Tutorials:** Step-by-step setup guides
- **Status Page:** Real-time system status

### Contact

- **Technical Support:** api-support@gensap.com
- **Documentation:** docs@gensap.com
- **Security Issues:** security@gensap.com

## Versioning

API version follows semantic versioning: `v1.0.0`

### Changelog

- **v1.0.0:** Initial release with core features
- **v1.1.0:** Added real-time WebSocket support
- **v1.2.0:** Enhanced monitoring and analytics

---

*Last updated: May 8, 2026*
