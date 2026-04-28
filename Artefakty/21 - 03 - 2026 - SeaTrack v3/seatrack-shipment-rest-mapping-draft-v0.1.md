# SeaTrack x TSE Shipment REST
## Mapping Draft v0.1 (SeaTrack side)

Owner: Karol Torebko (M&M Air Sea Cargo)
Date: 21-03-2026
Purpose: Working draft to align payload, fields, and integration behavior before final Transsoft API specification.

## 1) Scope of Phase 1

In scope:
- Shipment Search
- Shipment Get
- Shipment Update
- Action commands (Next-Step simulation)
- Status/event read (STATI equivalent)

Out of scope:
- Shipment Create
- Bulk mass operations beyond defined paging limits

## 2) Assumed API Operations (to be confirmed by Transsoft)

| Operation | Method | Candidate path | SeaTrack use |
|---|---|---|---|
| Search shipments | GET or POST | /shipment/search | List/filter records for board views |
| Get shipment | GET | /shipment/{shipmentId} | Open details panel |
| Update shipment | PATCH or PUT | /shipment/{shipmentId} | Update editable fields from SeaTrack |
| Execute action | POST | /shipment/{shipmentId}/actions/{actionName} | Trigger next operational step in TSE |
| Get status history | GET | /shipment/{shipmentId}/events | Timeline and status synchronization |

Decision needed from Transsoft:
- GET vs POST for search
- PATCH vs PUT for update
- Final path naming and versioning

## 3) Minimal Request/Response Shapes

Search request (example intent):
- filters: status, customerOrderNumber, transportOrderNumber, dateFrom, dateTo, carrierCode
- paging: page, pageSize
- sorting: sortBy, sortDirection

Search response (minimum):
- items[] with ids, current status, key references, key dates
- page, pageSize, totalItems

Get response (minimum):
- shipment header
- parties (shipper, receiver, agents)
- cargo/containers
- status summary
- event timeline

Update request (minimum):
- shipmentId
- changed fields only (preferred) or full object (if required by API)
- changedBy and changedAt if audit fields are supported

Action request (minimum):
- actionName
- optional action parameters
- reason/comment (optional but preferred)

## 4) Field Mapping (SeaTrack -> TSE/HOMER)

| SeaTrack field | TSE/HOMER candidate | Notes |
|---|---|---|
| shipmentId | Unique System-ID | Primary technical identifier |
| customerOrderNumber | ORDERNUMBER | Business reference |
| transportOrderNumber | TRANSPORTORDERNUMBER | Transport reference |
| forwardingReference | Unique Forwarder-ID | If exposed in REST |
| statusCode | STATI status/event type | Confirm canonical status model |
| statusDate | Date of event | Use ISO 8601 in API response |
| statusTime | Time of event | Prefer full timestamp in API |
| shipperName | SHIPPER.NAME1 | Party block mapping |
| receiverName | RECEIVER.NAME1 | Party block mapping |
| loadPlace | LOADPLACE | Operational field |
| deliveryPlace | DELIVERYPLACE | Operational field |
| dispatchDate | DISPATCHINGDATE | Date normalization required |
| deliveryDate | DELIVERYDATE | Date normalization required |
| containerNumber | CONTAINERNUMBER | Key tracking reference |
| grossWeight | GROSSWEIGHT | Unit and precision to confirm |
| volume | VOLUME | Unit mapping to confirm |
| hazardFlag | HAZMARK | Boolean/enum mapping to confirm |
| eventTimestamp | Date of event + Time of event | Prefer merged datetime in API |

## 5) Status and Event Alignment

SeaTrack assumption:
- Current status is derived from latest valid event by timestamp.
- Timeline stores immutable historical events.

Needs confirmation:
- Which event types are official source of truth for stage progression.
- Whether event correction/backfill can modify previous timeline items.
- Time standard in API (UTC strongly preferred).

## 6) Update Rules and Safety

SeaTrack expected rules:
- No blind overwrite of full shipment when only one field changes.
- Optimistic concurrency support preferred (version or updatedAt).
- Validation errors should return explicit field-level messages.

Needs confirmation:
- Conflict behavior when record changed in TSE after SeaTrack read.
- Forbidden fields in phase 1 (security/license policy).

## 7) Action Commands (Phase 1)

Requested clarification from Transsoft:
- Exact action catalog (for example: confirm booking, handover, customs step, release, close).
- Preconditions per action.
- Action response payload (new status, event id, timestamps).

SeaTrack behavior proposal:
- Display only actions returned as allowed for current shipment state.
- Write action result to event timeline immediately after success.

## 8) Non-Functional Requirements

Requested baseline:
- Error model: HTTP status + structured error object (code, message, details).
- Pagination limits: clear max pageSize.
- Rate limits and retry guidance.
- Sandbox environment before production cutover.
- API versioning policy.

## 9) Open Questions to Close Before Build

- Is search endpoint designed for interactive UI filtering or only backend integration loads?
- Are there webhook/event push options, or only pull via search/get/events?
- Which fields are mandatory for successful update?
- What are acceptance test scenarios for go-live?

## 10) Proposed Next Step

- Transsoft returns redlines on sections 2-9.
- Joint 45-minute technical alignment call.
- Freeze Mapping Draft v1.0 and begin adapter implementation in SeaTrack.
