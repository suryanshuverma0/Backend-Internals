# Node.js Memory Leak Demonstrations (GC & Heap Behavior)

This repository demonstrates **how Node.js memory leaks happen even with Garbage Collection**, using two small, observable examples.

The goal is to **see memory growth**, not just talk about it.

---

## Files in this repo

### 1. `bad-cache.js` — Unbounded In-Memory Cache
Simulates a **real backend mistake** where an in-memory cache grows forever with traffic.

### 2. `memory-leak.js` — Intentional Heap Leak
Demonstrates a **pure memory leak** by continuously storing data in memory.

---

## 1️⃣ Unbounded Cache Example (`bad-cache.js`)

### What the code does
- Stores user data in a global `cache` object
- Cache grows with **unique user IDs**
- No eviction, no limit
- Logs heap memory usage periodically

### Sample logs (no traffic)

```
Cache size: 0 | Heap Used: 8.34 MB
Cache size: 0 | Heap Used: 6.71 MB
Cache size: 0 | Heap Used: 6.75 MB
```


Heap stays mostly stable because no new IDs are added.

### What happens under traffic
When hitting:

```
/user/1
/user/2
/user/3
...
```


- Cache size increases
- Heap memory increases
- Memory never comes back down
- Garbage Collector cannot free memory because references remain

### Key takeaway
> Unbounded caches cause memory leaks when keys grow with traffic.

---

## 2️⃣ Intentional Memory Leak (`memory-leak.js`)

### What the code does
- Pushes large objects into a global array on an interval
- Objects are **never released**
- Logs heap usage every 500ms

### Sample logs


```
Heap Used: 4.46 MB
Heap Used: 7.14 MB
Heap Used: 10.22 MB
Heap Used: 14.96 MB
Heap Used: 18.68 MB
Heap Used: 21.75 MB
```


Memory grows continuously until Node crashes with:



### Key takeaway
> Garbage Collection only frees unreachable memory, not memory you keep referencing.

---

## Core Lessons

- GC does not prevent memory leaks
- Global references are dangerous
- Unbounded data structures kill Node servers
- Memory leaks are **logic bugs**, not GC bugs
- Node often dies slowly before crashing

---

## Why this matters in real systems

Most Node.js production crashes happen due to:
- Bad caches
- Growing global state
- Long-running processes
- Memory leaks that go unnoticed

Understanding this is critical for backend stability.

---

## How to run

```bash
node bad-cache.js
node memory-leak.js

```
