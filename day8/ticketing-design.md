# TicketHub - Event Ticketing System Design (Day 8 Assignment)

## 1. Requirements

### Functional
- **User Management**: Users can sign up, log in, and authenticate via secure tokens.
- **Event Discovery**: Users can browse, search, and view upcoming concerts and events.
- **Seat Selection**: Users can view interactive seating maps and check real-time seat availability (available, locked, booked).
- **Seat Reservation (Hold)**: Users can temporarily hold selected seats for a limited time (e.g., 10 minutes) while completing payment.
- **Checkout & Payment**: Users can pay for their held seats to finalize the purchase and generate digital orders/tickets.
- **Order History**: Users can view all of their successfully purchased tickets.

### Non-Functional
- **Correctness & Consistency**: Zero tolerance for double-booking or overselling under any circumstances.
- **Fairness**: First-come, first-served queueing during high-demand flash sales, preventing bot domination.
- **Speed & Latency**: Event browsing and seat maps must load in under 300 ms.
- **Availability & Scalability**: The system must withstand massive flash-sale traffic spikes without crashing (99.9% availability).

---

## 2. Traffic Estimates & Comparison

### Baseline (Normal Traffic)
- **Registered Users**: 2,000,000 users.
- **Daily Active Users (DAU)**: 20% = 400,000 DAU.
- **Daily Visits**: 50,000 people visit on a normal day.
- **Page Views**: Each visitor views 10 pages $\rightarrow$ $50,000 \times 10 = 500,000$ page views/day.
- **Average Read Traffic**: $\frac{500,000 \text{ views}}{86,400 \text{ seconds}} \approx 5.8$ requests/second.
- **Normal Ticket Sales**: 5,000 tickets sold per day $\approx 0.05$ transactions/second.

### Peak Traffic ("Big Sale" Flash Sale)
- **Scenario**: A very popular concert goes on sale.
- **Demand**: 200,000 people try to buy tickets within the first 10 minutes (600 seconds).
- **Capacity**: Only 20,000 seats are available.
- **Peak Write / Checkout Traffic**: 200,000 users attempting to lock and buy seats in a 10-minute window creates intense write contention, averaging $\approx 333$ checkout/lock requests per second, with browsing and seat-checking spikes reaching several thousand requests per second.

### Comparison
Normal traffic is extremely lightweight ($\sim 5.8$ req/s), easily handled by standard web servers. In contrast, the flash sale creates a **100x+ surge** concentrated heavily on a single event page and specific seat inventory, presenting severe write contention and race conditions.

---

## 3. API Design

| Method | Endpoint | Description | Success Status |
|--------|----------|-------------|----------------|
| GET | `/api/v1/events` | Browse and search upcoming events | `200 OK` |
| GET | `/api/v1/events/{id}/seats` | View real-time seat map and availability | `200 OK` |
| POST | `/api/v1/seats/hold` | Temporarily hold/lock selected seats | `201 Created` |
| POST | `/api/v1/orders` | Process payment and finalize ticket purchase | `201 Created` |
| GET | `/api/v1/users/me/tickets` | View purchased tickets for the logged-in user | `200 OK` |

---

## 4. Data Model (Relational Schema)

### Tables
1. **`users`**: Stores user account details (id, name, email, password_hash, created_at).
2. **`events`**: Stores event details (id, title, description, date, venue, total_seats, created_at).
3. **`seats`**: Stores individual seat inventory (id, event_id, seat_number, status ['available', 'locked', 'booked'], locked_until, version).
4. **`orders`**: Stores completed transaction records (id, user_id, event_id, seat_id, status, payment_reference, created_at).

### Relationships
- **users → orders (One-to-Many)**: A user can place many orders.
- **events → seats (One-to-Many)**: An event contains many seats.
- **events → orders (One-to-Many)**: An event has many ticket orders.
- **seats → orders (One-to-One / Optional)**: A seat can be tied to a completed order.

---

## 5. Preventing Double-Booking (Concurrency Control)

To ensure two users never buy the same seat during high-concurrency flash sales, TicketHub employs **database transactions with row-level locking**:

1. **Transaction Isolation (`SERIALIZABLE` or `READ COMMITTED` with explicit locking)**: When a user attempts to hold a seat (`POST /api/v1/seats/hold`), the database opens a transaction (`BEGIN`).
2. **Row Locking (`SELECT ... FOR UPDATE`)**: The server queries the specific seat row with a lock:
   ```sql
   SELECT id, status FROM seats WHERE id = 105 AND status = 'available' FOR UPDATE;