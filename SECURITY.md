# Security Policy

## Supported Versions

Currently, only the latest release of Blousia® is supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within Blousia®, please send an email to security@blousia.com. All security vulnerabilities will be promptly addressed.

## Security Features Implemented

*   **Helmet.js**: Implements HTTP headers that secure the Express app from well-known web vulnerabilities (XSS, Clickjacking, MIME sniffing).
*   **CORS**: Cross-Origin Resource Sharing is strictly configured to allow only trusted domains.
*   **Rate Limiting**: `express-rate-limit` mitigates brute-force attacks and DDoS by limiting API requests per IP.
*   **Cookie Security**: Using `cookie-parser` for handling HTTP-only and secure cookies.
*   **PWA Security**: Enforced HTTPS for Service Workers and Manifest configurations.
