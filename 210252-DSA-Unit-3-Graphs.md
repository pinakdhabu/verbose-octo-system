# 210252: Data Structures and Algorithms — Unit III: Graphs

**University:** Savitribai Phule Pune University (SPPU)  
**Program:** S.E. Computer Engineering (2019 Pattern)  
**Semester:** IV  
**Duration:** 07 Hours  
**CO Mapping:** CO2, CO3, CO4  
**Exam Weightage:** ~14–18 marks (End Sem) + ~4–6 marks (Mid Sem)

---

## Syllabus (Verbatim)

> Basic Concepts, Storage representation — Adjacency matrix, adjacency list, adjacency multi list, inverse adjacency list. Traversals — depth first and breadth first. Minimum spanning Tree, Greedy algorithms for computing minimum spanning tree — Prim's and Kruskal's Algorithms. Dijkstra's Single source shortest path. All pairs shortest paths — Floyd-Warshall Algorithm. Topological ordering.
>
> **Case Study:** Data structure used in Webgraph and Google Map

---

## CO—Bloom Mapping for Unit III

| Topic | CO | Bloom Level |
|---|---|---|
| Basic Concepts | CO2 | L1 — Remember |
| Storage Representations | CO2 | L2 — Understand |
| Graph Traversals (BFS/DFS) | CO3 | L3 — Apply |
| MST — Prim's / Kruskal's | CO4 | L4 — Analyze |
| Shortest Path (Dijkstra) | CO3 | L3 — Apply |
| Shortest Path (Floyd-Warshall) | CO4 | L4 — Analyze |
| Topological Ordering | CO3 | L3 — Apply |

---

## 1. Basic Concepts of Graphs

### Definition

A **Graph** `G = (V, E)` is an ordered pair where:
- `V` — finite set of **vertices** (nodes)
- `E` — finite set of **edges** (arcs) connecting pairs of vertices

```
V = {v₁, v₂, ..., vₙ}
E = {e₁, e₂, ..., eₘ}, each e ⊆ V × V
```

### Key Terminology

| Term | Definition |
|---|---|
| **Vertex (Node)** | Fundamental unit — a data element |
| **Edge (Arc)** | Connection between two vertices |
| **Degree of vertex** | Number of edges incident on a vertex |
| **In-degree** | Number of incoming edges (directed graph) |
| **Out-degree** | Number of outgoing edges (directed graph) |
| **Self-loop** | Edge from a vertex to itself |
| **Path** | Sequence of vertices where each adjacent pair is connected by an edge |
| **Cycle** | Path that starts and ends at the same vertex with no repeated edges |
| **Connected graph** | Path exists between every pair of vertices |
| **Complete graph** | Every pair of vertices is directly connected; Kₙ has n(n-1)/2 edges |
| **Weighted graph** | Each edge has an associated numeric weight (cost, distance, etc.) |
| **Subgraph** | A subset of vertices and edges of a graph |
| **Spanning subgraph** | Subgraph that includes all vertices of the original graph |

### Graph Classification

```
                    ┌──────────────────────────────┐
                    │           GRAPH               │
                    └──────────────┬───────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
      ┌───────┴───────┐   ┌───────┴───────┐   ┌───────┴───────┐
      │   UNDIRECTED  │   │   DIRECTED    │   │   WEIGHTED    │
      │               │   │   (Digraph)   │   │               │
      │  Edge (u,v) = │   │  Edge u→v ≠   │   │  Edge has     │
      │  (v,u)        │   │  v→u          │   │  cost/dist    │
      └───────────────┘   └───────────────┘   └───────────────┘
```

### Example

```
Undirected:             Directed:
   A ───── B              A ─────→ B
   │       │              │        │
   │       │              ↓        ↓
   C ───── D              C ←───── D

V = {A, B, C, D}        V = {A, B, C, D}
E = {(A,B), (A,C),      E = {(A→B), (A→C),
     (B,D), (C,D)}          (B→D), (D→C)}
```

---

## 2. Storage Representation of Graphs

### 2.1 Adjacency Matrix

**Definition:** A 2D boolean/integer matrix `A[n][n]` where `A[i][j] = 1` if edge `(vi, vj)` exists, else `0`.

```
Given graph:
    1 ─── 2
    │   ╱
    │ ╱
    3

Adjacency Matrix:
       1   2   3
  ┌─────────────────
1 │   0   1   1
2 │   1   0   1
3 │   1   1   0
```

**Properties:**
- Unweighted: O(1) edge lookup
- Symmetric for undirected graphs (`A[i][j] = A[j][i]`)
- Storage: **O(V²)**
- Weighted: store weight instead of 1
- Directed: asymmetric

| Feature | Adjacency Matrix |
|---|---|
| Edge lookup | O(1) |
| Add edge | O(1) |
| Remove edge | O(1) |
| Space | O(V²) |
| Find all neighbors | O(V) |
| Best for | Dense graphs |

### 2.2 Adjacency List

**Definition:** An array of linked lists. `adj[i]` points to a list of all vertices adjacent to vertex `i`.

```
Graph (same as above):
    1 ─── 2
    │   ╱
    │ ╱
    3

Adjacency List:
1 → [2] → [3]
2 → [1] → [3]
3 → [1] → [2]
```

**Properties:**
- Storage: **O(V + E)** — linear space
- Best for sparse graphs
- Edge lookup: O(deg(v))

| Feature | Adjacency List |
|---|---|
| Edge lookup | O(deg(v)) |
| Add edge | O(1) |
| Remove edge | O(deg(v)) |
| Space | O(V + E) |
| Find all neighbors | O(deg(v)) |
| Best for | Sparse graphs |

### 2.3 Comparison: Adjacency Matrix vs Adjacency List

| Dimension | Adjacency Matrix | Adjacency List |
|---|---|---|
| Space | O(V²) | O(V + E) |
| Edge existence check | O(1) | O(deg(v)) |
| Find all neighbors | O(V) | O(deg(v)) |
| Add vertex | O(V²) amortized | O(1) |
| Add edge | O(1) | O(1) |
| Remove edge | O(1) | O(deg(v)) |
| Preferred when | Dense graph (E ≈ V²) | Sparse graph (E ≪ V²) |
| Implementation | 2D array | Array of linked lists |

### 2.4 Adjacency Multi-list

**Definition:** An edge-centric representation where each edge node is shared between two vertex lists. Useful when edge modification is frequent.

```
Structure of edge node:
┌──────┬──────┬──────┬──────┐
│ mark │ v_i  │ v_j  │ next │
│ flag │      │      │_link │
└──────┴──────┴──────┴──────┘

- mark: visited flag (for traversals)
- v_i, v_j: endpoints of the edge
- next_link: pointer to next edge incident on v_i (or v_j)
```

**Key point:** One edge node appears exactly once, linked into both vertex chains.

### 2.5 Inverse Adjacency List

**Definition:** For directed graphs — stores the list of **predecessors** (incoming edges) for each vertex, while the standard adjacency list stores successors.

```
Graph:  A → B → C
        ↑   │
        └───┘

Adjacency List (outgoing):
A → [B]
B → [C]
C → []

Inverse Adjacency List (incoming):
A → []
B → [A]
C → [B]
```

**Useful for:** Finding in-degree quickly, reverse traversal, topological sort (Kahn's algorithm).

---

## 3. Graph Traversals

### 3.1 Breadth First Search (BFS)

**Concept:** Level-order traversal using a **queue**. Visit all neighbors at the current depth before moving deeper.

```
Algorithm BFS(start):
  mark all vertices as NOT_VISITED
  create empty Queue Q
  mark start as VISITED
  Q.enqueue(start)

  while Q is not empty:
      v = Q.dequeue()
      process(v)
      for each neighbor u of v:
          if u is NOT_VISITED:
              mark u as VISITED
              Q.enqueue(u)
```

**Trace Example:**

```
Graph:
    A ─── B
    │     │
    C ─── D

BFS(start = A):
Step | Queue      | Visit | Explanation
─────┼────────────┼───────┼────────────────
1    | [A]        | -     | Enqueue start
2    | [B, C]     | A     | Dequeue A, enqueue unvisited neighbors B, C
3    | [C, D]     | B     | Dequeue B, enqueue unvisited neighbor D
4    | [D]        | C     | Dequeue C (D already in queue, skip)
5    | []         | D     | Dequeue D

Order: A → B → C → D
```

| Property | Value |
|---|---|
| Data structure | Queue |
| Time complexity | O(V + E) — adjacency list |
| Space complexity | O(V) |
| Complete? | Yes (finds all vertices) |
| Optimal for | Unweighted shortest path |
| Applications | Shortest path (unweighted), Peer-to-peer networks, Web crawling, Social networks |

### 3.2 Depth First Search (DFS)

**Concept:** Explore as far as possible along each branch before backtracking. Uses a **stack** (explicit or recursion).

```
Algorithm DFS(start):
  mark all vertices as NOT_VISITED
  create empty Stack S
  S.push(start)

  while S is not empty:
      v = S.pop()
      if v is NOT_VISITED:
          mark v as VISITED
          process(v)
          for each neighbor u of v:
              if u is NOT_VISITED:
                  S.push(u)
```

**Trace Example (same graph):**

```
Graph:
    A ─── B
    │     │
    C ─── D

DFS(start = A):
Step | Stack           | Visit | Explanation
─────┼─────────────────┼───────┼────────────────
1    | [A]             | -     | Push start
2    | [B, C]          | A     | Pop A (visit), push unvisited neighbors (order B,C)
3    | [B]             | C     | Pop C (visit), push... (C has neighbors A,D; A visited, push D)
4    | [B, D]          | -     | (push from C's neighbors)
5    | [B]             | D     | Pop D (visit), D neighbors: B, C (both visited)
6    | []              | B     | Pop B (visit)

Order: A → C → D → B
```

**Recursive Version:**

```
Algorithm DFS_Recursive(v):
  mark v as VISITED
  process(v)
  for each neighbor u of v:
      if u is NOT_VISITED:
          DFS_Recursive(u)
```

| Property | Value |
|---|---|
| Data structure | Stack (or recursion) |
| Time complexity | O(V + E) — adjacency list |
| Space complexity | O(V) |
| Applications | Cycle detection, Topological sort, Connected components, Maze generation, Puzzle solving |

### 3.3 BFS vs DFS

| Dimension | BFS | DFS |
|---|---|---|
| Data structure | Queue | Stack |
| Traversal order | Level-order (wide) | Depth-order (deep) |
| Space (worst case) | O(V) — wide graph | O(V) — deep graph |
| Shortest path (unweighted) | ✅ Yes | ❌ No |
| Cycle detection | ❌ Not primary | ✅ Yes |
| Topological sort | ✅ Kahn's algorithm | ✅ Using finish times |
| Connected components | ✅ | ✅ |
| Memory per vertex | Visited + Queue | Visited + Stack |
| Backtracking | No | Inherent |

---

## 4. Minimum Spanning Tree (MST)

### Definition

A **Spanning Tree** of a connected, undirected graph G is a subgraph that:
- Includes all vertices of G
- Is a tree (connected + acyclic)
- Has exactly (V − 1) edges

A **Minimum Spanning Tree** is the spanning tree with the minimum total edge weight.

```
Given Graph:                  MST:
    A ──2── B                  A ──2── B
    │       │                  │
    3       4                  3
    │       │                  │
    C ──1── D                  C ──1── D

Total weight: 2+3+1 = 6 (MST)
```

### 4.1 Prim's Algorithm

**Concept:** Greedy — grow the tree one vertex at a time. Always add the **minimum-weight edge** connecting a visited vertex to an unvisited vertex.

```
Algorithm Prim(G, start):
  MST = empty set
  visited = {start}

  while visited ≠ V:
      find edge (u, v) with minimum weight
      where u ∈ visited and v ∉ visited
      add v to visited
      add (u, v) to MST

  return MST
```

**Time complexity:** O(V²) naive | O(E log V) using min-heap  
**Space complexity:** O(V)

**Trace:**

```
Graph:
    A ──2── B
    │\     /│
    │ 4   3 │
    │/     \│
    D ──1── C

Start at A:

Step  | Visited    | Candidate Edges       | Pick   | MST Edges
──────┼────────────┼───────────────────────┼────────┼────────────
1     | {A}        | (A,B)=2, (A,D)=4      | (A,B)=2| {(A,B)}
2     | {A,B}      | (A,D)=4, (B,C)=3      | (B,C)=3| {(A,B),(B,C)}
3     | {A,B,C}    | (A,D)=4, (C,D)=1      | (C,D)=1| {(A,B),(B,C),(C,D)}
4     | {A,B,C,D}  | —                      | —      | Complete

MST weight = 2 + 3 + 1 = 6
```

**Exam Tip:** For a 6-mark question, you MUST show the candidate edge table at each step. Without it, you lose marks.

### 4.2 Kruskal's Algorithm

**Concept:** Greedy — sort all edges by weight, then pick the smallest edge **that does not form a cycle** (use Union-Find / Disjoint Set Union).

```
Algorithm Kruskal(G):
  MST = empty set
  sort all edges by weight ascending
  create disjoint sets for each vertex

  for each edge (u, v) in sorted order:
      if find(u) ≠ find(v):      // no cycle
          add (u, v) to MST
          union(u, v)

      if MST has V-1 edges: break

  return MST
```

**Time complexity:** O(E log E) — dominated by sorting  
**Space complexity:** O(V)

**Trace (same graph):**

```
Sorted edges: (C,D)=1, (A,B)=2, (B,C)=3, (A,D)=4, (A,C)=5, (B,D)=6

Step | Edge   | Weight | Sets (after union) | Action
─────┼────────┼────────┼────────────────────┼────────────
1    | (C,D)  | 1      | {A}, {B}, {C,D}    | Add
2    | (A,B)  | 2      | {A,B}, {C,D}       | Add
3    | (B,C)  | 3      | {A,B,C,D}          | Add (V-1=3 edges ✓)
4    | (A,D)  | 4      | —                  | Skip (cycle)
5    | (A,C)  | 5      | —                  | Skip (all connected)

MST: (C,D)=1, (A,B)=2, (B,C)=3 — weight = 6
```

### 4.3 Prim's vs Kruskal's

| Dimension | Prim's | Kruskal's |
|---|---|---|
| Approach | Vertex-based growth | Edge-based selection |
| Data structure | Min-heap / Adjacency list | Union-Find / Disjoint Set |
| Time complexity | O(E log V) with heap | O(E log E) |
| Best when | Dense graphs (E ≈ V²) | Sparse graphs (E ≪ V²) |
| Cycle detection | Implicit (visited set) | Explicit (Union-Find) |
| Greedy choice | Local — min edge from visited set | Global — min edge overall |
| Stable across weight changes | ✅ Yes | Yes, until weights change order |

**Exam Prediction:** A 6-mark comparison table question appears regularly. Also, a numerical MST problem on a 5-6 node graph for 6-8 marks.

---

## 5. Shortest Path Algorithms

### 5.1 Dijkstra's Algorithm — Single Source Shortest Path

**Concept:** Find shortest paths from a source vertex to all other vertices in a **weighted graph with non-negative weights**.

```
Algorithm Dijkstra(G, source):
  dist[source] = 0
  for each vertex v ≠ source: dist[v] = ∞
  visited = empty set

  while visited ≠ V:
      u = vertex with minimum dist[u] not in visited
      visited.add(u)

      for each neighbor v of u:
          if v not in visited:
              newDist = dist[u] + weight(u, v)
              if newDist < dist[v]:
                  dist[v] = newDist
                  prev[v] = u    // for path reconstruction

  return dist[], prev[]
```

**Time complexity:** O(V²) naive | O((V+E) log V) with priority queue  
**Space complexity:** O(V)

**Trace:**

```
Graph:
    A ──4──→ B
    │       │
    │2      │5
    ↓       ↓
    C ──1──→ D

Source = A

Step | Visited  | dist[A] | dist[B] | dist[C] | dist[D] | Pick
─────┼──────────┼─────────┼─────────┼─────────┼─────────┼─────
Init | {}       | 0       | ∞       | ∞       | ∞       | —
1    | {A}      | 0       | 4       | 2       | ∞       | A
2    | {A,C}    | 0       | 4       | 2       | 3 (2+1) | C
3    | {A,C,B}  | 0       | 4       | 2       | 3       | B
4    | {A,C,B,D}| 0       | 4       | 2       | 3       | D

Shortest distances from A:
A→A: 0,  A→B: 4,  A→C: 2,  A→D: 3 (via: A→C→D)
```

**Limitation:** ❌ Does NOT work with negative weight edges. Use Bellman-Ford for that.

### 5.2 Floyd-Warshall Algorithm — All Pairs Shortest Path

**Concept:** Dynamic Programming — consider each vertex as an intermediate point, updating the shortest path between every pair.

```
Let dist[n][n] = adjacency matrix of the graph (∞ for no direct edge)

Algorithm FloydWarshall(G):
  dist = adjacency matrix initialized:
      dist[i][j] = weight(i,j) if edge exists
      dist[i][i] = 0
      dist[i][j] = ∞ if no edge

  for k = 0 to V-1:             // intermediate vertex
      for i = 0 to V-1:         // source
          for j = 0 to V-1:     // destination
              if dist[i][k] + dist[k][j] < dist[i][j]:
                  dist[i][j] = dist[i][k] + dist[k][j]

  return dist[][]
```

**Recurrence:**  
`dist(i, j) = min(dist(i, j), dist(i, k) + dist(k, j))`

**Time complexity:** O(V³) — three nested loops  
**Space complexity:** O(V²)

**Trace:**

```
Graph:
    1 ──3──→ 2
    │       │
    │8      │2
    ↓       ↓
    3 ←─── 4
         5

Initial dist matrix:
       1   2   3   4
  ┌──────────────────
1 │   0   3   8   ∞
2 │   ∞   0   ∞   2
3 │   ∞   ∞   0   5   (corrected: original says 3←4 weight 5)
4 │   ∞   ∞   ∞   0

Wait — let me restate the graph properly:

Graph edges:
1 → 2 (weight 3)
1 → 3 (weight 8)
2 → 4 (weight 2)
4 → 3 (weight 5)
3 → 1, 2 → 3, etc. — let me use a cleaner example:

Actual clean trace:
Graph:
    1 ──2──→ 2
    │\      │\
    │ \6    │ \1
    │  \    │  \
    ↓   →   ↓   →
    3 ←──3── 4
         1

Dist matrix setup:
    1   2   3   4
1:  0   2   6   ∞
2:  ∞   0   ∞   1
3:  ∞   ∞   0   ∞   (no outgoing from 3 in this example)
4:  ∞   ∞   3   0

After k=1 (intermediate vertex = 1):
  dist[2][3] = min(∞, dist[2][1]+dist[1][3]) = min(∞, ∞+6) = ∞ (no change)
  dist[4][1] = min(∞, dist[4][1]+...) — no change

After k=2 (intermediate vertex = 2):
  dist[1][4] = min(∞, dist[1][2]+dist[2][4]) = min(∞, 2+1) = 3
  dist[3][4] = min(∞, dist[3][2]+dist[2][4]) = min(∞, ∞+1) = ∞
  dist[1][3] = min(6, dist[1][2]+dist[2][3]) = min(6, 2+∞) = 6

After k=3: ...
After k=4 (intermediate vertex = 4):
  dist[1][3] = min(6, dist[1][4]+dist[4][3]) = min(6, 3+3) = 6 ✓
  dist[2][3] = min(∞, dist[2][4]+dist[4][3]) = min(∞, 1+3) = 4

Final shortest paths:
1→2: 2    1→3: 6    1→4: 3
2→3: 4    2→4: 1
4→3: 3
```

### 5.3 Dijkstra vs Floyd-Warshall

| Dimension | Dijkstra | Floyd-Warshall |
|---|---|---|
| Paths found | Single source → all | All pairs |
| Technique | Greedy (priority queue) | Dynamic Programming |
| Time | O(E log V) | O(V³) |
| Space | O(V) | O(V²) |
| Edge weights | Non-negative only | Any (but no negative cycles) |
| Best when | Need 1→All | Need All→All |
| Implementation | Complex (heap) | Simple (3 loops) |

---

## 6. Topological Ordering

### Definition

A **Topological Order** of a Directed Acyclic Graph (DAG) is a linear ordering of vertices such that for every directed edge `u → v`, vertex `u` appears before `v` in the ordering.

**Only defined for DAGs** — a graph with a cycle has no topological order.

### 6.1 Kahn's Algorithm (BFS-based)

```
Algorithm TopologicalSort_Kahn(G):
  compute in-degree for each vertex
  Q = queue of all vertices with in-degree = 0
  result = []

  while Q is not empty:
      u = Q.dequeue()
      result.append(u)

      for each neighbor v of u:
          in_degree[v]--
          if in_degree[v] == 0:
              Q.enqueue(v)

  if result has all V vertices:
      return result        // valid topological sort
  else:
      return error         // graph has a cycle
```

**Time complexity:** O(V + E)  
**Space complexity:** O(V)

### 6.2 DFS-based (Using Finish Times)

```
Algorithm TopologicalSort_DFS(G):
  visited = {}
  stack = []    // stores result (reversed finish order)

  for each vertex v in G:
      if v not visited:
          DFS_Topo(v)

  return stack.reverse()

DFS_Topo(v):
  mark v as visited
  for each neighbor u of v:
      if u not visited:
          DFS_Topo(u)
  stack.append(v)    // push after all neighbors processed
```

**Time complexity:** O(V + E)

### 6.3 Trace (Kahn's Algorithm)

```
Graph (DAG):
     A ──→ B
     │     │
     ↓     ↓
     C ──→ D
           ↑
           │
           E

In-degrees: A=0, B=1, C=1, D=2, E=0

Step | Queue    | Pop  | Result     | Updated in-degrees
─────┼──────────┼──────┼────────────┼─────────────────────
1    | [A, E]   | A    | [A]        | B:1→0, C:1→0
2    | [E, B, C]| E    | [A, E]     | D:2→1
3    | [B, C]   | B    | [A, E, B]  | D:1→0
4    | [C, D]   | C    | [A, E, B, C]| —
5    | [D]      | D    | [A, E, B, C, D]| —

Result: A → E → B → C → D (valid topological order)
```

**Applications:**
- Build systems (Makefile dependency resolution)
- Course prerequisite scheduling
- Task scheduling with dependencies
- Compiler (instruction scheduling)
- Package managers (dependency resolution)

---

## 7. Case Study: Data Structures in Webgraph and Google Maps

### Webgraph (Web Structure)

- **Vertices:** Web pages (URLs)
- **Edges:** Hyperlinks (directed — page A links to page B)
- **Storage:** Adjacency list (sparse — avg degree ~10 per page)
- **Traversal:** BFS (Web crawler) — breadth-first discovered pages level by level
- **Key DS:** Adjacency list + Hash table (URL-to-ID mapping) + Queue (BFS frontier)
- **Algorithm:** PageRank uses graph computation on the webgraph

**Why adjacency list?** The web is massive (billions of pages, ~V² is impossible). Adjacency list gives O(V+E) space, feasible for web-scale.

### Google Maps (Road Network)

- **Vertices:** Intersections / locations
- **Edges:** Roads (weighted by distance / time / traffic)
- **Storage:** Adjacency list (road networks are sparse — each intersection connects to ~4-8 roads)
- **Key algorithms:**
  - **Dijkstra's / A\*** — shortest path between two points
  - **Floyd-Warshall** — NOT practical for map scale (O(V³) too large)
  - **Precomputed all-pairs** on highway nodes only (contraction hierarchies)
- **Data structures:** Adjacency list with weight, Min-heap (priority queue for Dijkstra), Hash table (location → vertex)

---

## 8. Formula & Complexity Sheet

| Algorithm | Time Complexity | Space Complexity | Data Structure |
|---|---|---|---|
| BFS | O(V + E) | O(V) | Queue |
| DFS | O(V + E) | O(V) | Stack / Recursion |
| Prim's (heap) | O(E log V) | O(V) | Min-heap |
| Kruskal's | O(E log E) | O(V) | Union-Find |
| Dijkstra (heap) | O((V+E) log V) | O(V) | Priority Queue |
| Floyd-Warshall | O(V³) | O(V²) | 2D array |
| Topological sort (Kahn) | O(V + E) | O(V) | Queue |
| Topological sort (DFS) | O(V + E) | O(V) | Stack |

---

## 9. Expected Exam Questions (Pattern Analysis)

| Question Type | Marks | Frequency |
|---|---|---|
| Explain BFS/DFS with example and algorithm | 6 | Very High |
| Trace Prim's/Kruskal's on a given graph | 6-8 | Very High |
| Compare adjacency matrix vs adjacency list | 4 | High |
| Trace Dijkstra's algorithm on weighted graph | 6 | High |
| Trace Floyd-Warshall (all-pair path matrix) | 8 | Medium |
| Topological sort — given DAG, write order | 4 | High |
| Explain graph representations with examples | 6 | Medium |
| Webgraph/Google Maps case study | 4 | Medium |
| MST applications / real-world use | 2-4 | Low |
| Difference between BFS and DFS (table) | 4 | High |
| Cycle detection using DFS | 4 | Medium |
| Write Prim's/Kruskal's algorithm with pseudocode | 6 | Medium |

**Command Words Used:**
- **Define / State** (L1) — 2 marks — terminology
- **Explain / Describe** (L2) — 4 marks — BFS/DFS, MST, topological sort
- **Apply / Solve / Trace** (L3) — 6-8 marks — dry-run algorithm on given graph
- **Compare / Differentiate** (L4) — 4 marks — matrix vs list, Prim's vs Kruskal's, BFS vs DFS
- **Analyze / Justify** (L4-L5) — 6-8 marks — complex graph problems

---

## 10. Rapid Revision — One Page Summary

### TOP 5 DEFINITIONS

1. **Graph:** `G = (V, E)` — set of vertices and edges
2. **Spanning Tree:** Subgraph with all V vertices, (V-1) edges, no cycles
3. **MST:** Spanning tree with minimum total edge weight
4. **Topological Order:** Linear ordering of DAG where each edge u→v has u before v
5. **Degree:** Number of edges incident on a vertex (in-degree / out-degree for digraph)

### TOP 5 FORMULAS / KEY POINTS

1. **Adjacency Matrix:** Space = O(V²), edge lookup = O(1)
2. **Adjacency List:** Space = O(V+E), neighbor traversal = O(deg(v))
3. **Complete graph Kₙ:** `n(n-1)/2` edges
4. **BFS:** Queue, shortest path (unweighted), O(V+E)
5. **Floyd-Warshall:** `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])` — triple nested loop, O(V³)

### QUICK COMPARISONS

| A | B | Key Difference |
|---|---|---|
| BFS | DFS | Queue vs Stack; Level-order vs Depth-order |
| Prim's | Kruskal's | Vertex-growth vs Edge-selection; Heap vs Union-Find |
| Adj Matrix | Adj List | O(V²) vs O(V+E) space; dense vs sparse |
| Dijkstra | Floyd | Single source vs All-pairs; O(E log V) vs O(V³) |
| Directed | Undirected | Edges have direction vs bidirectional |

### EXAM PREDICTION

Most likely 8-mark question: **"Apply Prim's/Dijkstra's algorithm on given weighted graph and find MST / shortest path."**  
Most likely 6-mark question: **"Explain BFS/DFS with example and algorithm."**  
Most likely 4-mark question: **"Compare adjacency matrix and adjacency list."**

### MUST-KNOW

BFS/DFS algorithms + traces, Prim's/Kruskal's trace, Dijkstra trace, Floyd-Warshall trace, Topological sort (Kahn's), Comparison tables

### MNEMONIC

**BFS-DS: Q** (BFS uses Queue) → **Think "Breadth-Queue"** (B is for Breadth & Queue starts with Q sound — "B-Queue")  
**DFS-DS: S** (DFS uses Stack) → **Think "Depth-Stack"** (D is for Depth)

**Prim's rule:** Pick the **cheapest edge from visited to unvisited**  
**Kruskal's rule:** Sort all edges → **cheapest that doesn't create cycle**

---

## 11. Learning Acceleration Footer

| Item | Details |
|---|---|
| **Spaced Repetition Schedule** | D1 | D2 | D4 | D8 | D16 |
| **Top 3 Mnemonics** | BFS→Queue, DFS→Stack; "Prim picks from visited set"; "Kruskal sorts then unions" |
| **Self-Test Questions** | See Section 12 below |
| **Feynman Challenge** | "Explain in one sentence: Why can't Dijkstra handle negative edges?" |
| **Cross-Link** | Unit I (Hashing — O(1) lookup) ↔ Adjacency Matrix (O(1) edge lookup) |
| **Bloom Level Reached** | L4 (Analyze) — Push to L5 by evaluating which MST algorithm is better for a given graph density |

---

## 12. Self-Test Questions

**Q1:** What is the degree of each vertex in a complete graph K₆?  
*Answer: 5 (each vertex connects to all 5 others)*

**Q2:** Which graph representation is preferred for a graph with 10,000 vertices and 15,000 edges? Why?  
*Answer: Adjacency list — space O(V+E) ≈ 25,000 vs matrix O(V²) = 10⁸*

**Q3:** Trace Dijkstra on the graph where A→B=1, A→C=4, B→C=2, B→D=6, C→D=3 with source A.  
*Check your answer: A→B=1, A→C=3 (via B), A→D=6 (via B→C→D)*

**Q4:** Can Floyd-Warshall handle negative weight edges?  
*Answer: Yes, as long as there are no negative-weight cycles*

**Q5:** What happens if Kahn's algorithm processes all vertices and some edges remain unaccounted for?  
*Answer: The graph contains a cycle — topological sort is impossible*

**Q6:** How many edges are there in a spanning tree of a graph with 12 vertices?  
*Answer: 11 (V−1)*

**Q7:** Write pseudocode for BFS using a queue.  
*See Section 3.1*

**Q8:** Compare the space usage of adjacency matrix and adjacency list for a graph with 100 vertices and 200 edges.  
*Answer: Matrix = 100² = 10,000 slots. List = 100 + 200 = 300 nodes. List wins.*

---

*End of Unit III — Graphs Notes*
