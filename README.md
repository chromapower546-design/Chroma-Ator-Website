# Chroma-Ator Website

## SMTP notifications

Quote requests, contact messages, and job applications are saved in the admin portal and trigger an email notification to `sales@chroma-ator.com`. Job application emails include the uploaded resume when one is provided.

Configure SMTP by copying `.env.example` to `.env` and filling in the SMTP values from your email provider:

- `SMTP_HOST`: SMTP server hostname.
- `SMTP_PORT`: SMTP server port, commonly `587` for STARTTLS or `465` for implicit TLS.
- `SMTP_SECURE`: Set to `true` for implicit TLS (usually port 465); otherwise use `false`. If omitted, port 465 enables it automatically.
- `SMTP_USER` and `SMTP_PASS`: SMTP credentials. Both may be omitted if the SMTP relay does not require authentication.
- `SMTP_FROM`: Optional sender address accepted by the SMTP provider. Defaults to `SMTP_USER`, or `sales@chroma-ator.com` for an unauthenticated relay.

Restart the server after changing `.env`. Never commit the `.env` file or share its credentials. If SMTP delivery fails, the submission remains available in the admin portal and the website reports that the email notification was not sent; the server logs the failure.
