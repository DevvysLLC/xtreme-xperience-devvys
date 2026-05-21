# Simplify Guard, Wizard Context and Page Hooks

## Goal

Eliminate:

- Render loops
- Cross-page hook coupling
- Context churn
- Duplicate navigation logic
- Object identity dependency issues

Establish:

- Single navigation authority
- Single persistence boundary
- Pure validation logic
- Primitive-based state only

## Architecture Reset

Guard = Navigation Brain
Pages = Form + Persist
Booking State = Cross-page contract
Context = Optional UI-only state

## Guard Owns All Redirects

- Pages NEVER call `router.push`
- Pages NEVER compute next page
- Guard evaluates wizard state and redirects

## Pages Only Do Three Things

Each page:

- Read persisted page state
- Render and manage form
- Persist on submit

No redirect logic. No previous-step validation. No context mutation for flow.

## Page Hooks Must Be Thin

Page hook returns:

- `persisted`
- `isValid` (pure boolean)
- `save()`

No cross-page hooks. No context merging. No object dependency chains. No navigation logic.

## Validity Is Pure

`isValid` must depend only on:

- persisted page data
- primitive cart summary

Never on:

- other page hooks
- context state
- large objects
- router
- side effects

## Guard Computes Accessibility From Booking State Only

Use:

`getMaxAccessiblePageIndex(booking)`

Booking state is the single cross-page contract.

Guard logic:

- If current page index > max → redirect back
- If page just became valid → redirect forward
- If cart invalidates page → redirect appropriately

Single decision function.

## Context Simplification

Context is no longer flow state.

It may store:

- selectedDayDate (string)
- selectedEventId (string)
- activeTabIndex (number)

Never:

- full schedule objects
- booking data
- validity
- redirect intent

Context becomes UI convenience only.

## Persistence Model

Single direction:

- Page submit → persist booking state
- Booking state updates
- Guard reacts
- Guard redirects

No bidirectional syncing. No form ↔ context loops. No form ↔ booking loops.

## What Gets Deleted

- Cross-page hook calls
- Page-level router pushes
- Logging inside render/memo
- Object dependency arrays
- Default value merging from multiple sources
- Guard mutating booking state unless strictly necessary

## Resulting Flow

On Load:

- Guard checks booking
- Redirects to first accessible page

On Page:

- Page loads persisted values
- User edits form

On Submit:

- Page persists booking state
- Guard detects new accessible page
- Guard redirects

No page navigation logic required.

## What This Fixes

- Infinite render loops
- Race conditions between guard and page
- Object reference churn
- Duplicate flow logic
- Cross-page validation coupling
- Form reinitialization thrash

## Mental Model

Wizard = state machine\
Guard = state machine controller\
Pages = state mutators\
Booking state = machine state
