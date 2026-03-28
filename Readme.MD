# Zilhla Parishad Backend API

### Authentication — `/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/initiate` | Start auth flow — send OTP to email |
| POST | `/auth/request_otp` | Request a new OTP |
| POST | `/auth/resend_otp` | Resend OTP to same email |
| POST | `/auth/verify_otp` | Verify OTP and receive tokens |
| POST | `/auth/login` | Login with email + password |
| POST | `/auth/register` | Register a new user |
| POST | `/auth/refresh` | Refresh access token using refresh token |
| DELETE | `/auth/logout` | Logout / invalidate session |

---


## 🚦 HTTP Status Codes

| Code | Meaning | When used |
|------|---------|-----------|
| `200` | OK | Successful read / update / operation |
| `201` | Created | Resource successfully created |
| `304` | Not Modified | Resource same as last request |
| `400` | Bad Request | Missing or invalid parameters |
| `401` | Unauthorized | Invalid credentials or expired OTP |
| `403` | Forbidden | Account inactive / access denied |
| `404` | Not Found | Resource does not exist |
| `409` | Conflict | Duplicate resource (already exists) |
| `429` | Too Many Requests | OTP / auth rate limit exceeded |
| `500` | Internal Server Error | Unexpected server-side failure |

---
