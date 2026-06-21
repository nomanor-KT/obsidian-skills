Subject: SeaTrack x TSE Shipment REST - Preparation Questions and Next Steps

Hi [Name],

Thank you for your message and for confirming the integration direction.
We appreciate that Transsoft will cover development costs for the Shipment REST interface.

We are aligned with the approach:
- close frontend connection to TSE,
- initial scope with Search, Get, Update,
- Action commands for Next-Step simulation,
- no CREATE in phase 1.

To prepare on our side and avoid rework, please confirm the points below.

1) API scope and semantics
- Exact endpoint paths for Shipment Search, Get, Update, and Action commands.
- Update model: full replacement or partial update.
- Phase 1 action list with expected request bodies.

2) Data contract (JSON)
- Will JSON be a 1:1 mapping of HOMER Shipment XML and HOMER-STATI XML?
- Mandatory vs optional fields in Search/Get/Update.
- Fields excluded in phase 1 due to security or license constraints.

3) Query and paging
- Supported search filters/operators (exact, contains, ranges, status, dates).
- Pagination model (page/size or cursor), default and max page size.
- Sorting options and ordering guarantees.

4) Status and events
- Source of truth for shipment status transitions.
- Whether STATI is event history only or also current status snapshot.
- Timestamp standard (UTC/local) and format.

5) Auth, security, and license constraints
- Authentication model (token/session/basic/other).
- Access scope (customer/account/user role).
- Explicit usage boundaries to ensure full license compliance.

6) Reliability and operations
- Error model (status codes and error schema).
- Rate limits/throttling, timeout expectations, retry guidance.
- Sandbox/test environment and go-live acceptance criteria.

7) Delivery plan
- Timeline for spec freeze, development start, test handover, and production readiness.
- Technical owner on Transsoft side (Reiner) for interface clarifications and test support.

If useful, we can share a short SeaTrack-side mapping draft to speed up alignment.

Once Marek confirms the final project decision, we are ready to proceed immediately.

Best regards,
Karol Torebko
Head of Sea Freight Department
M&M Air Sea Cargo S.A.
