# SnapShare System Scaling Plan

## 1. Assumptions & Daily Active Users (DAU)

* **Registered Users:** 10,000,000 users
* **Daily Active User (DAU) Ratio:** 10% of total registered users[cite: 11]
* **Daily Active Users (DAU):** $10,000,000 \times 0.10 = 1,000,000\text{ users/day}$[cite: 11]
* **User Behavior:** Each active user uploads 1 photo per day and requests 50 feed pages per day[cite: 11].
* **File Sizes:** Original photo size = 2 MB; Thumbnail size = 50 KB (0.05 MB)[cite: 11].
* **Seconds in a Day:** $24 \times 60 \times 60 = 86,400\text{ seconds}$.

---

## 2. Quantitative Estimates

### A. Uploads Per Second
* **Total Uploads per Day:** $1,000,000\text{ photos/day}$[cite: 11]
* **Average Uploads per Second:** 
  $$\frac{1,000,000}{86,400} \approx 11.57\text{ uploads/sec}$$
* **Peak Uploads per Second ($5\times$ Peak):** 
  $$11.57 \times 5 \approx 57.87\text{ uploads/sec}$$
[cite: 11]

### B. Feed Views Per Second
* **Total Feed Views per Day:** $1,000,000 \text{ DAU} \times 50 \text{ pages/day} = 50,000,000\text{ views/day}$[cite: 11]
* **Average Feed Views per Second:** 
  $$\frac{50,000,000}{86,400} \approx 578.70\text{ views/sec}$$
* **Peak Feed Views per Second ($5\times$ Peak):** 
  $$578.70 \times 5 \approx 2,893.50\text{ views/sec}$$
[cite: 11]

### C. Photo Storage Per Year
* **Daily Storage per Photo:** $2\text{ MB (original)} + 0.05\text{ MB (thumbnail)} = 2.05\text{ MB/photo}$[cite: 11]
* **Daily Storage Total:** $1,000,000 \times 2.05\text{ MB} = 2,050,000\text{ MB/day} = 2.05\text{ TB/day}$[cite: 11]
* **Yearly Storage Total ($365\text{ days}$):** 
  $$2.05\text{ TB/day} \times 365 \approx 748.25\text{ TB/year}$$

---

## 3. Read-Heavy vs. Write-Heavy System

SnapShare is a **read-heavy** system[cite: 11].

* **Ratio Analysis:** Feed views (~578.7 avg requests/sec) outnumber photo uploads (~11.57 avg requests/sec) by a ratio of 50 to 1[cite: 11].
* **Design Impact:** Because reads vastly dominate writes, the system architecture prioritizes aggressive caching layer strategies (Redis/Memcached) and static media delivery via Content Delivery Networks (CDNs) to offload traffic from core app servers and primary databases[cite: 11].

---

## 4. Media Storage Strategy

Photos must **not** be stored directly inside relational databases as BLOBs because storing large binary files bloats database size, degrades backup/restore performance, consumes excessive DB memory buffer pools, and slows down indexing.

Instead, photos are stored in **scalable Object Storage** (e.g., AWS S3 or Azure Blob Storage), while the database stores only metadata and string URIs pointing to the photo files in object storage[cite: 11].

---

## 5. Text Architecture Diagram
[ Users / Clients ]
                                   |
               +-------------------+-------------------+
               |                                       |
         (Static Media)                           (API Requests)
               v                                       v
      +-----------------+                     +-----------------+
      |       CDN       |                     |  Load Balancer  |
      +-----------------+                     +-----------------+
               |                                       |
               v                                       v
     +-------------------+                   +-------------------+
     |  Object Storage   |                   |    App Servers    |
     |  (S3 / Blobs)     |                   +-------------------+
     +-------------------+                   /         |         \
               ^                            /          |          \
               |                           v           v           v
               |                   +-------+   +---------------+  +-------+
               |                   | Cache |   | Async Queue   |  | Primary|
               |                   |(Redis)|   | (RabbitMQ/    |  | Database|
               |                   +-------+   |    SQS)       |  +-------+
               |                               +---------------+      |
               |                                       |          (Replication)
               |                                       v              v
               |                               +---------------+  +-------+
               |                               | Worker Service|  | Read  |
               +-------------------------------|(Thumbnails)   |  | Replica|
                                               +---------------+  +-------+

             ---

## 6. System Component Explanations

1. **CDN (Content Delivery Network):** Caches and serves photo files and static assets from edge locations physically close to users to minimize latency[cite: 11].
2. **Load Balancer:** Distributes incoming HTTP API traffic evenly across multiple app servers to prevent any single server from becoming a bottleneck[cite: 11].
3. **App Servers:** Executes core application logic, handles authentication, processes incoming requests, and orchestrates database and storage operations[cite: 11].
4. **Cache (In-Memory):** Stores user sessions, user feeds, and frequently accessed post metadata in memory to deliver fast response times for feed views[cite: 11].
5. **Primary Database:** Handles all relational database write operations, such as creating new posts and user account management[cite: 11].
6. **Read Replica Database:** Offloads read queries—such as fetching user profiles and feed data—from the primary database to improve read scalability[cite: 11].
7. **Object Storage:** Provides scalable, cost-effective storage for high-volume original photos and generated thumbnail files[cite: 11].
8. **Message Queue:** Accepts asynchronous background jobs for processing tasks without blocking the user's synchronous upload request[cite: 11].
9. **Worker Service:** Consumes jobs from the queue to asynchronously generate compressed thumbnails and update object storage[cite: 11].

---

## 7. Step-by-Step Photo Upload Flow

1. **Upload Request:** The user uploads a photo from the client app; the request reaches the Load Balancer and is routed to an App Server[cite: 11].
2. **Direct Media Save:** The App Server streams the raw original photo (2 MB) directly to Object Storage and receives a unique photo URL[cite: 11].
3. **Metadata Persistence:** The App Server writes the photo record (user ID, timestamp, photo URL) to the Primary Database[cite: 11].
4. **Enqueue Background Task:** The App Server publishes a `create-thumbnail` event message (containing the photo URL) to the Message Queue and immediately responds `201 Created` to the client app[cite: 11].
5. **Async Processing:** A background Worker pulls the job from the Message Queue, downloads the original photo from Object Storage, generates a 50 KB thumbnail, and uploads the thumbnail to Object Storage[cite: 11].
6. **Cache Invalidation / Update:** The worker or database updates the post metadata in the Database with the thumbnail URL and invalidates or updates the user's follower feed cache[cite: 11].

---

## 8. Architectural Trade-offs

1. **Asynchronous Processing vs. Eventual Consistency:**
   * **Trade-off:** By processing thumbnails asynchronously in a queue, photo uploads are fast for users[cite: 11]. However, there is a short propagation delay where a user might view their newly uploaded photo before the thumbnail has finished generating[cite: 11].
2. **Read Replicas vs. Replication Lag:**
   * **Trade-off:** Adding read replicas significantly increases read throughput for the feed[cite: 11]. However, asynchronous replication between the primary database and read replicas introduces the risk that users briefly see stale feed data[cite: 11].                                  