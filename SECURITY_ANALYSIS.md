# SmartHub Web Application Security Analysis

## Requirement 2.1 - OWASP Top 10 Security Analysis

This document analyses security risks relevant to the SmartHub Service Request System and records the controls implemented to reduce those risks.

## 1. Broken Access Control

### Risk
Users may attempt to access or modify data that belongs to another user, provider, administrator, or payment manager.

### SmartHub Controls
- Role-based route protection is implemented in the React application.
- Firestore security rules restrict access using authenticated user IDs and roles.
- Customers can only access bookings linked to their own user ID.
- Providers can only access bookings assigned to them and can only modify or delete services associated with their provider ID.
- Administrative operations require an admin role.
- Payment transaction access is restricted to admins and payment managers.
- Users cannot change their own role or account status.

### Status
Mitigated through role-based access control and Firestore ownership checks.

---

## 2. Identification and Authentication Failures

### Risk
Unauthorised users may attempt to access protected application areas without valid authentication.

### SmartHub Controls
- Firebase Authentication is used for user authentication.
- Protected routes redirect unauthenticated users to the login page.
- Application roles are loaded from authenticated user profiles.
- Provider accounts remain pending until approved by an administrator.

### Status
Mitigated through Firebase Authentication and role-based route protection.

---

## 3. Security Misconfiguration

### Risk
Overly permissive database permissions may expose or allow modification of application data.

### SmartHub Controls
- Firestore rules use deny-by-default behaviour for unmatched collections.
- User, provider, booking, service, transaction, notification, and audit-log permissions are explicitly defined.
- Administrative audit logs cannot be updated or deleted.
- Provider verification status and admin notes cannot be modified by providers themselves.

### Status
Mitigated through explicit Firestore security rules.

---

## 4. Vulnerable and Outdated Components

### Risk
Third-party dependencies may contain known vulnerabilities.

### SmartHub Controls
- npm audit was used to analyse project dependencies.
- An earlier project health check identified 10 dependency vulnerabilities.
- npm audit fix was applied safely without using --force.
- A later audit reported 0 vulnerabilities.
- Automated tests and the production build were rerun after dependency updates.

### Status
Mitigated through dependency auditing and validation.

---

## 5. Security Logging and Monitoring Failures

### Risk
Administrative changes may occur without traceability.

### SmartHub Controls
- Administrative actions are recorded in the adminAuditLogs collection.
- Logs include administrator details, action type, target, reason, previous value, new value, and timestamp.
- Audit logs cannot be modified or deleted through Firestore security rules.

### Status
Mitigated through administrative audit logging.

---

## 6. Transport Security

### Risk
Application traffic could be exposed if transmitted without encryption.

### SmartHub Controls
- The deployed SmartHub application is served over HTTPS.
- HTTPS protects application traffic between the browser and the deployed web application.

### Status
Mitigated through HTTPS deployment.

---

## Security Testing Evidence

The following evidence is used to validate the implemented controls:

- Automated test suite: 21 tests passed.
- Production build completed successfully.
- npm audit reported 0 vulnerabilities after remediation.
- GitHub Actions automatically runs tests and production builds.
- Firestore security rules enforce role and ownership restrictions.
- HTTPS is enabled on the deployed application.

## Residual Risks and Constraints

Some risks remain despite the current controls:

- Client-side security must always be supported by Firestore rules because route protection alone can be bypassed.
- Provider financial totals are currently updated from the client-side workflow. A trusted backend or Cloud Function would provide stronger financial integrity.
- Notification creation is intentionally broad enough to support the existing booking workflow and could be further restricted in a backend-based implementation.
- Automated security testing coverage is currently limited compared with specialised penetration-testing tools.
- Additional OWASP testing using tools such as OWASP ZAP could provide deeper vulnerability scanning.

## Conclusion

SmartHub applies authentication, role-based access control, Firestore security rules, dependency security checks, audit logging, and HTTPS to reduce relevant web application security risks.

The current implementation provides practical security controls for the project while also identifying areas that could be strengthened in a future production deployment.
