# 210252: Data Structures and Algorithms — Unit IV: Search Trees

**University:** Savitribai Phule Pune University (SPPU)  
**Program:** S.E. Computer Engineering (2019 Pattern)  
**Semester:** IV  
**Duration:** 08 Hours  
**CO Mapping:** CO2, CO3, CO5  
**Exam Weightage:** ~16–20 marks (End Sem) + ~6–8 marks (Mid Sem)

---

## Syllabus (Verbatim)

> Symbol Table — Representation of Symbol Tables — Static tree table and Dynamic tree table. Weight balanced tree — Optimal Binary Search Tree (OBST), OBST as an example of Dynamic Programming. Height Balanced Tree — AVL tree. Red-Black Tree, AA tree, K-dimensional tree, Splay Tree.
>
> **Case Study:** Keyword search in a document using OBST
>
> **COs:** CO2, CO3, CO5 | **Duration:** 08 Hours

---

## CO—Bloom Mapping for Unit IV

| Topic | CO | Bloom Level |
|---|---|---|
| Symbol Table — basic concepts, operations | CO2 | L1 — Remember |
| Static vs Dynamic tree table representation | CO2 | L2 — Understand |
| OBST — DP formulation and construction | CO3 | L3 — Apply |
| AVL Tree — rotations, insertion, deletion | CO3 | L3 — Apply |
| Red-Black Tree — properties, insertion | CO3 | L3 — Apply |
| AA Tree — skew, split operations | CO2 | L2 — Understand |
| K-d Tree — construction, NN search concept | CO5 | L4 — Analyze |
| Splay Tree — splaying, amortized analysis | CO5 | L4 — Analyze |
| Case Study: Keyword search using OBST | CO5 | L4 — Analyze |

---

## 1. Symbol Table

### 1.1 Definition and Purpose

A **Symbol Table** is a data structure used by compilers / assemblers / interpreters to store information about identifiers (symbols) — variable names, function names, class names, array names, labels, etc.

**Purpose:**
- Store the **name** (lexeme) and associated **attributes** (type, scope, memory address, value)
- Provide fast **lookup** during lexical analysis, syntax analysis, semantic analysis, and code generation

**Typical attributes stored for each symbol:**

| Attribute | Description |
|---|---|
| Name | Identifier string |
| Type | int, float, char, array, function, struct, etc. |
| Scope | Global, local, block-level |
| Memory address | Offset or absolute address |
| Value | Constant value (if applicable) |
| Array dimension(s) | If type is array |
| Parameter list | If type is function |
| Return type | If type is function |

### 1.2 Operations on Symbol Table

| Operation | Description |
|---|---|
| **Insert** | Add a new symbol with its attributes |
| **Lookup (Search)** | Find a symbol by name and retrieve its attributes |
| **Delete** | Remove a symbol (when scope exits) |
| **Modify** | Update attributes of an existing symbol |

### 1.3 Static Tree Table

**Definition:** A symbol table implemented using a **fixed-size** data structure built at compile-time. Once constructed, insertions and deletions are not supported at runtime.

**Implementation approaches:**

| Approach | Lookup | Insert | Space | Use case |
|---|---|---|---|---|
| Unsorted array | O(N) linear search | O(1) append | O(N) | Small symbol sets |
| Sorted array | O(log N) binary search | O(N) shift | O(N) | Single-pass compilers |
| Static hash table | O(1) average | O(1) at build | O(N) | Fixed keyword sets |

```
Static Symbol Table (Sorted Array):

┌───────┬──────────┬───────┬─────────┐
│ Index │ Name     │ Type  │ Address │
├───────┼──────────┼───────┼─────────┤
│ 0     │ a        │ int   │ 1000    │
│ 1     │ b        │ float │ 1004    │
│ 2     │ count    │ int   │ 1008    │
│ 3     │ temp     │ char  │ 1012    │
│ 4     │ x        │ int   │ 1016    │
│ 5     │ y        │ float │ 1020    │
└───────┴──────────┴───────┴─────────┘
       ↑ Sorted alphabetically by name
```

**Characteristics:**
- Memory allocated once — no fragmentation
- Binary search gives O(log N) lookup
- Insertion requires shifting — O(N) — not suitable for dynamic scope management
- Used in languages with single-pass compilation (Pascal, FORTRAN)

### 1.4 Dynamic Tree Table

**Definition:** A symbol table implemented using a **dynamic** data structure supporting efficient insert, delete, and lookup at any stage.

**Implementation approaches:**

| Approach | Avg. Lookup | Avg. Insert | Avg. Delete | Space |
|---|---|---|---|---|
| Binary Search Tree | O(log N) | O(log N) | O(log N) | O(N) |
| Hash Table | O(1) | O(1) | O(1) | O(N) |
| Trie | O(L) — key length | O(L) | O(L) | O(L × N) |

```
Dynamic Symbol Table (BST):

         ┌──────────┐
         │  count   │
         │  int     │
         │  1008    │
         └────┬─────┘
              │
       ┌──────┴──────┐
       │             │
  ┌────┴────┐   ┌────┴────┐
  │   a     │   │   x     │
  │  int    │   │  int    │
  │  1000   │   │  1016   │
  └─────────┘   └─────────┘
```

**Characteristics:**
- Dynamic allocation — grows and shrinks as scopes open/close
- O(log N) average operations (BST) — suitable for incremental compilation
- Overhead of pointer storage
- Scope management via **stack of trees** — push on block entry, pop on exit
- Used in C, C++, Java, and modern multi-pass compilers

### 1.5 Static vs Dynamic Symbol Table

| Dimension | Static Table | Dynamic Table |
|---|---|---|
| Memory | Fixed at compile time | Grows/shrinks at runtime |
| Insertion | At build time only | Any time |
| Deletion | Not supported | Supported |
| Lookup | O(log N) binary search | O(log N) BST / O(1) hash |
| Implementation | Array / Sorted array | BST / Hash table / Trie |
| Scope handling | Difficult | Easy (stack of tables) |
| Compiler type | Single-pass | Multi-pass |
| Pointer overhead | None | Present |
| Fragmentation | None | Possible |

### 1.6 Scope Management Mechanism

```
┌─────────────────────────────────────┐
│       GLOBAL SYMBOL TABLE           │
│  ┌──────┬──────┬──────┬──────┐     │
│  │  a   │  PI  │ temp │ func │     │
│  └──────┴──────┴──────┴──────┘     │
└─────────────────────────────────────┘
         ↑   push     │
         │            ▼
┌─────────────────────────────────────┐
│    FUNCTION func() SYMBOL TABLE     │
│  ┌──────┬──────┬──────┐            │
│  │  x   │  y   │  i   │            │
│  └──────┴──────┴──────┘            │
└─────────────────────────────────────┘
         ↑   push     │
         │            ▼
┌─────────────────────────────────────┐
│      BLOCK { } SYMBOL TABLE         │
│  ┌──────┬──────┐                   │
│  │  j   │  k   │                   │
│  └──────┴──────┘                   │
└─────────────────────────────────────┘
```

**Lookup rule:** Search from top (innermost scope) downward to outermost. First match wins.

---

## 2. Weight Balanced Tree — Optimal Binary Search Tree (OBST)

### 2.1 Problem Definition

Given `n` keys `K = {k₁, k₂, ..., kₙ}` with known **search probabilities** `P = {p₁, p₂, ..., pₙ}` and dummy keys `{d₀, d₁, ..., dₙ}` (representing gaps / unsuccessful searches) with probabilities `Q = {q₀, q₁, ..., qₙ}`, construct a BST that **minimizes the expected search cost**.

```
Constraints:
  • Keys are ordered: k₁ < k₂ < ... < kₙ
  • Σpᵢ + Σqⱼ = 1.0
  • pᵢ = probability of searching for key kᵢ
  • qⱼ = probability of searching between kⱼ and kⱼ₊₁
```

**Expected search cost formula:**
```
E = Σ (depth(kᵢ) + 1) × pᵢ + Σ depth(dⱼ) × qⱼ
```

### 2.2 OBST as Dynamic Programming

**Why DP?** OBST exhibits **optimal substructure**: if an optimal tree has root `kᵣ`, then its left subtree (keys i..r-1) and right subtree (keys r+1..j) must themselves be optimal.

**Greedy fails:** Choosing the most probable key as root does NOT guarantee optimality — the tree shape depends on both probabilities and key ordering constraints.

#### 2.2.1 DP Recurrence

**Notation:**
- `cost[i][j]` = minimum expected cost for keys `kᵢ..kⱼ` (with dummies `dᵢ₋₁..dⱼ`)
- `w[i][j]` = weight = sum of probabilities for keys `kᵢ..kⱼ` including surrounding dummies
- `root[i][j]` = optimal root index for keys `kᵢ..kⱼ`

**Base cases (empty subtree):**
```
cost[i][i-1] = 0
  w[i][i-1] = qᵢ₋₁     (dummy key probability)
```

**Weight recurrence:**
```
w[i][j] = w[i][j-1] + pⱼ + qⱼ
```

**Cost recurrence:**
```
cost[i][j] =  min   { cost[i][k-1] + cost[k+1][j] }  +  w[i][j]
             i≤k≤j
```

**Intuition:** Try every key `k` as the root. The cost is:
- cost of left subtree (i..k-1)
- plus cost of right subtree (k+1..j)
- plus `w[i][j]` (one extra depth level for all keys in this subtree)

#### 2.2.2 Algorithm Pseudocode

```
Algorithm OBST(n, p[1..n], q[0..n]):

  // Step 1: Initialize empty subtrees
  for i = 1 to n + 1:
      cost[i][i-1] = 0
      w[i][i-1] = q[i-1]
      root[i][i-1] = 0

  // Step 2: Build DP tables by increasing chain length
  for len = 1 to n:
      for i = 1 to n - len + 1:
          j = i + len - 1

          w[i][j] = w[i][j-1] + p[j] + q[j]

          cost[i][j] = ∞
          for k = i to j:
              temp = cost[i][k-1] + cost[k+1][j]
              if temp < cost[i][j]:
                  cost[i][j] = temp
                  root[i][j] = k

          cost[i][j] = cost[i][j] + w[i][j]

  // Step 3: Return results
  return cost[1][n], root[1..n][1..n]
```

**Time Complexity:** O(n³) — three nested loops  
**Space Complexity:** O(n²) — two tables (cost and root)

**Optimization (Knuth, 1971):** Restrict root search to `root[i][j-1] ≤ k ≤ root[i+1][j]`, reducing to O(n²).

### 2.3 Full Trace — OBST Construction (4 Keys)

**Input Data:**
```
Keys:     10     20     30     40
  p [ ] =  3      3      1      1
  q [ ] =   2      3      1      1      1
         └─ d₀   d₁     d₂     d₃     d₄
```

**Step 1 — Initialize (len = 0):**

cost[i][j] table:

| i \ j | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| **1** | 0 | — | — | — | — |
| **2** | — | 0 | — | — | — |
| **3** | — | — | 0 | — | — |
| **4** | — | — | — | 0 | — |
| **5** | — | — | — | — | 0 |

w[i][j] table:

| i \ j | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| **1** | 2 | — | — | — | — |
| **2** | — | 3 | — | — | — |
| **3** | — | — | 1 | — | — |
| **4** | — | — | — | 1 | — |
| **5** | — | — | — | — | 1 |

**Step 2 — len = 1 (single key):**

| i | j | w[i][j] | k=1 | k=2 | k=3 | k=4 | min | cost | root |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 2+3+3=8 | cost[1][0]+cost[2][2]=0 | — | — | — | 0 | 0+8=8 | 1 |
| 2 | 2 | 3+3+1=7 | — | cost[2][1]+cost[3][3]=0 | — | — | 0 | 0+7=7 | 2 |
| 3 | 3 | 1+1+1=3 | — | — | cost[3][2]+cost[4][4]=0 | — | 0 | 0+3=3 | 3 |
| 4 | 4 | 1+1+1=3 | — | — | — | cost[4][3]+cost[5][5]=0 | 0 | 0+3=3 | 4 |

**Step 3 — len = 2 (two-key subtrees):**

```
i=1, j=2:
  w[1][2] = w[1][1] + p₂ + q₂ = 8 + 3 + 1 = 12
  k=1: cost[1][0] + cost[2][2] = 0 + 7 = 7    ← min
  k=2: cost[1][1] + cost[3][2] = 8 + 0 = 8
  cost[1][2] = 7 + 12 = 19,  root[1][2] = 1

i=2, j=3:
  w[2][3] = w[2][2] + p₃ + q₃ = 7 + 1 + 1 = 9
  k=2: cost[2][1] + cost[3][3] = 0 + 3 = 3    ← min
  k=3: cost[2][2] + cost[4][3] = 7 + 0 = 7
  cost[2][3] = 3 + 9 = 12,  root[2][3] = 2

i=3, j=4:
  w[3][4] = w[3][3] + p₄ + q₄ = 3 + 1 + 1 = 5
  k=3: cost[3][2] + cost[4][4] = 0 + 3 = 3    ← min
  k=4: cost[3][3] + cost[5][4] = 3 + 0 = 3    ← min (tie)
  cost[3][4] = 3 + 5 = 8,  root[3][4] = 3 (pick first in tie)
```

**Step 4 — len = 3 (three-key subtrees):**

```
i=1, j=3:
  w[1][3] = w[1][2] + p₃ + q₃ = 12 + 1 + 1 = 14
  k=1: cost[1][0] + cost[2][3] = 0 + 12 = 12
  k=2: cost[1][1] + cost[3][3] = 8 + 3 = 11    ← min
  k=3: cost[1][2] + cost[4][3] = 19 + 0 = 19
  cost[1][3] = 11 + 14 = 25,  root[1][3] = 2

i=2, j=4:
  w[2][4] = w[2][3] + p₄ + q₄ = 9 + 1 + 1 = 11
  k=2: cost[2][1] + cost[3][4] = 0 + 8 = 8    ← min
  k=3: cost[2][2] + cost[4][4] = 7 + 3 = 10
  k=4: cost[2][3] + cost[5][4] = 12 + 0 = 12
  cost[2][4] = 8 + 11 = 19,  root[2][4] = 2
```

**Step 5 — len = 4 (full tree):**

```
i=1, j=4:
  w[1][4] = w[1][3] + p₄ + q₄ = 14 + 1 + 1 = 16
  k=1: cost[1][0] + cost[2][4] = 0 + 19 = 19
  k=2: cost[1][1] + cost[3][4] = 8 + 8 = 16    ← min
  k=3: cost[1][2] + cost[4][4] = 19 + 3 = 22
  k=4: cost[1][3] + cost[5][4] = 25 + 0 = 25
  cost[1][4] = 16 + 16 = 32,  root[1][4] = 2
```

**Step 6 — Tree Construction:**

```
root[1][4] = 2  →  root = k₂ (key 20)
  Left:  root[1][1] = 1  →  k₁ (key 10) is left child
  Right: root[3][4] = 3  →  k₃ (key 30) is root of right subtree
    Right of k₃: root[4][4] = 4  →  k₄ (key 40) is right child

Optimal BST Structure:

           ┌───────────┐
           │   20      │
           │  (k₂)     │
           └─────┬─────┘
                 │
        ┌────────┴────────┐
        │                 │
   ┌────┴────┐      ┌────┴────┐
   │   10    │      │   30    │
   │  (k₁)   │      │  (k₃)   │
   └────┬────┘      └────┬────┘
        │                │
     ┌──┴──┐          ┌──┴──┐
     │  d₀ │          │ 40  │
     │ q=2 │          │(k₄) │
     └─────┘          └──┬──┘
                         │
                      ┌──┴──┐
                      │  d₄ │
                      │ q=1 │
                      └─────┘

Minimum expected search cost = 32
```

### 2.4 OBST vs Regular BST

| Dimension | Regular BST | OBST |
|---|---|---|
| Construction | Insert in arbitrary order | DP based on probabilities |
| Key frequency | Not considered | Explicitly modeled |
| Optimality | Not guaranteed | Guaranteed optimal |
| Time to build | O(N) average | O(N³) |
| Search cost | O(log N) avg, O(N) worst | O(log N) guaranteed expected |
| Use case | General-purpose | Static dictionary with known frequencies |

### 2.5 OBST Applications

- **Compiler symbol tables** — keywords with known frequencies
- **Document keyword search** — frequent words higher in tree
- **Dictionary / spell checker** — common words accessed faster
- **Code optimization** — frequently executed symbols faster

### 2.6 Exam Tips (OBST)

| Tip | Marks | Frequency |
|---|---|---|
| Define OBST and write recurrence | 4 | High |
| Construct OBST for 3-4 keys with probabilities (full DP trace) | 6-8 | Very High |
| Explain why OBST uses DP and not greedy | 4 | Medium |
| Compare OBST with regular BST | 4 | Medium |
| Optimal vs height-balanced: difference | 2-4 | Low |

---

## 3. Height Balanced Tree — AVL Tree

### 3.1 Definition

An **AVL tree** (Adelson-Velsky and Landis, 1962) is a **self-balancing BST** where the balance factor of every node is in {-1, 0, +1}.

**Balance Factor:**
```
balance_factor(node) = height(left_subtree) - height(right_subtree)
```

**AVL Invariant:** |balance_factor| ≤ 1 for every node

```
Valid AVL Tree:                Invalid (not AVL):
      ┌──50────┐                   ┌──50────┐
      │bf = 1  │                   │bf = 2  │ ← violated
      │        │                   │        │
   ┌──30─┐    80                 ┌──30     80
   │bf=0 │    │bf=0│             │bf=-1
   │     │    │    │             │
  10     40   90               10──┐
  │bf=0││bf=0││bf=0│              35
  │    ││    ││    │              │bf=0│

height = 2                    height = 3
```

### 3.2 AVL Rotations (The 4 Cases)

When |balance_factor| > 1 after an insertion, rotation(s) restore balance.

#### 3.2.1 LL Imbalance — Right Rotation

**Scenario:** Insertion into **left child's left subtree**.

```
Before:                          After (Right Rotate on Z):

      Z (bf=+2)                        Y (bf=0)
     /                                /   \
    Y (bf=+1)        ──►             X     Z
   /
  X (bf=0)

Condition: bf(Z) = +2, bf(Y) = +1
Action:    Single right rotation on Z
```

```
Algorithm Rotate_Right(P):
  Q = P.left
  P.left = Q.right
  Q.right = P
  UpdateHeight(P)
  UpdateHeight(Q)
  return Q
```

**Example trace — Insert 10, 20, 30:**
```
Insert 10:    10(bf=0)

Insert 20:    10(bf=-1)
                \
                 20(bf=0)

Insert 30:    10(bf=-2)        ──►     20(bf=0)
                \                      /  \
                 20(bf=-1)           10    30
                   \
                    30(bf=0)

   bf(10) = -2 → RR case → Left rotate on 10
```

#### 3.2.3 LR Imbalance — Left-Right Rotation

**Scenario:** Insertion into **left child's right subtree**.

```
Before:                          After (Left rotate on Y, then Right rotate on Z):

      Z (bf=+2)                        X (bf=0)
     /                                /   \
    Y (bf=-1)       ──►              Y     Z
     \
      X (bf=0)

Condition: bf(Z) = +2, bf(Y) = -1
Action:    Left rotate on Y, then Right rotate on Z
```

```
Algorithm Rotate_Left_Right(P):
  P.left = Rotate_Left(P.left)
  return Rotate_Right(P)
```

**Example trace — Insert 30, 10, 20:**
```
Insert 30:    30(bf=0)

Insert 10:    30(bf=1)
             /
           10(bf=0)

Insert 20:    30(bf=2)         ──►     20(bf=0)
             /                         /  \
           10(bf=-1)                 10    30
             \
              20(bf=0)

   bf(30) = +2, bf(10) = -1 → LR case
   Step 1: Left rotate on 10 → gives 30→20→10
   Step 2: Right rotate on 30 → balanced
```

#### 3.2.4 RL Imbalance — Right-Left Rotation

**Scenario:** Insertion into **right child's left subtree**.

```
Before:                          After (Right rotate on Y, then Left rotate on Z):

    Z (bf=-2)                           X (bf=0)
     \                                 /   \
      Y (bf=+1)       ──►             Z     Y
     /
    X (bf=0)

Condition: bf(Z) = -2, bf(Y) = +1
Action:    Right rotate on Y, then Left rotate on Z
```

```
Algorithm Rotate_Right_Left(P):
  P.right = Rotate_Right(P.right)
  return Rotate_Left(P)
```

**Example trace — Insert 10, 30, 20:**
```
Insert 10:    10(bf=0)

Insert 30:    10(bf=-1)
                \
                 30(bf=0)

Insert 20:    10(bf=-2)        ──►     20(bf=0)
                \                      /  \
                 30(bf=+1)           10    30
                /
              20(bf=0)

   bf(10) = -2, bf(30) = +1 → RL case
   Step 1: Right rotate on 30 → gives 10→20→30
   Step 2: Left rotate on 10 → balanced
```

### 3.3 Rotation Summary

| Imbalance | bf(Z) | bf(Y) | Rotation | Description |
|---|---|---|---|---|
| LL | +2 | +1 | Right(Z) | Single right rotation |
| RR | -2 | -1 | Left(Z) | Single left rotation |
| LR | +2 | -1 | Left(Y) then Right(Z) | Double rotation |
| RL | -2 | +1 | Right(Y) then Left(Z) | Double rotation |

### 3.4 AVL Insertion — Complete Trace

Insert sequence: **50, 20, 80, 10, 30, 5**

```
Step 1: Insert 50
  50(bf=0)

Step 2: Insert 20
  50(bf=1)
 /
20(bf=0)

Step 3: Insert 80
    50(bf=0)
   /  \
 20    80
(bf=0) (bf=0)

Step 4: Insert 10
      50(bf=1)         ← OK
     /  \
   20(1) 80(0)
   /
 10(0)

Step 5: Insert 30
      50(bf=1)         ← OK
     /  \
   20(0) 80(0)
   / \
 10   30
(0)  (0)

Step 6: Insert 5
      50(bf=2)         ← IMBALANCE! bf(50)=2, bf(20)=+1 → LL case
     /  \
   20(1) 80(0)
   / \
 10(1) 30
 /
5(0)

Right rotate on 50:

      20(bf=0)
     /  \
   10    50
   / \   / \
  5  (d)30  80

All nodes now satisfy |bf| ≤ 1 ✓
```

### 3.5 AVL Deletion (Concept)

**Steps:**
1. Perform standard BST deletion
2. Walk back up toward root, updating balance factors
3. If |bf| > 1 at any node, apply the appropriate rotation
4. Continue checking up to the root (imbalance can propagate)

**Complexity:** O(log N) — same as insertion.

### 3.6 AVL Tree Complexity

| Operation | Time Complexity |
|---|---|
| Search | O(log N) |
| Insert | O(log N) |
| Delete | O(log N) |
| Space | O(N) |

**Height bound:** `h ≤ 1.44 × log₂(N+2)` — strictly O(log N) guaranteed.

---

## 4. Red-Black Tree

### 4.1 Definition

A **Red-Black Tree** is a self-balancing BST where each node stores an extra **color bit** (red or black) and satisfies 5 properties to guarantee O(log N) height.

### 4.2 The 5 Properties

```
1. Every node is either RED or BLACK
2. The ROOT is always BLACK
3. Every leaf (NIL) is BLACK
4. If a node is RED, BOTH its children are BLACK
     (No two consecutive red nodes)
5. For each node, all paths to descendant leaves contain the
   SAME number of BLACK nodes (same black-height)
```

**Black-height:** Number of black nodes on any path from a node to a leaf (excluding the node itself).

### 4.3 Why Height is O(log N)

**Lemma:** A Red-Black tree with `n` internal nodes has height ≤ 2 × log₂(n+1).

**Proof sketch:** If every root-to-leaf path has `b` black nodes, then:
- Minimum nodes in a tree with black-height `b` is `2ᵇ - 1` (a perfect tree of black nodes)
- Since no two consecutive reds: height `h ≤ 2 × b`
- Therefore: `n ≥ 2ʰᐟ² - 1` → `h ≤ 2 × log₂(n+1)`

### 4.4 Red-Black Tree Insertion

**Notation:** `P` = Parent, `U` = Uncle, `G` = Grandparent

**Insertion algorithm:**
1. Insert new node **Z** as a standard BST insertion
2. Color **Z RED** (to preserve property 5 — black-height)
3. Fix violations while `Z` is not root and `P` is RED

#### Insertion Cases

**Case 0: Z is root** — Recolor Z to BLACK.

```
   [Z] RED  →  [Z] BLACK
```

**Case 1: P is BLACK** — No violation. Done.

```
     G(BLACK)
    /       \
 P(BLACK)   U(RED)
  |
  Z(RED)      ← OK, no violation
```

**Case 2: P is RED, U is RED** — Recolor P, U to BLACK, G to RED. Continue from G.

```
     G(BLACK)                     G(RED)       ← may violate
    /       \                     /    \
 P(RED)    U(RED)      ──►   P(BLACK) U(BLACK)
  |                              |
 Z(RED)                        Z(RED)
```

**Case 3: P is RED, U is BLACK (or NIL)** — Rotations + recolor.

Three subcases (mirror images exist):

**Case 3a (LL):** Z is left child of P, P is left child of G.
```
       G(BLACK)                       P(BLACK)
      /        \                     /        \
   P(RED)    U(BLACK)    ──►      Z(RED)    G(RED)
   /                                              \
Z(RED)                                           U(BLACK)

Action: Right rotate on G, recolor P→BLACK, G→RED
```

**Case 3b (LR):** Z is right child of P, P is left child of G.
```
     G(BLACK)                         Z(BLACK)
    /        \                      /          \
 P(RED)    U(BLACK)   ──►        P(RED)       G(RED)
   \                                               \
    Z(RED)                                       U(BLACK)

Action: Left rotate on P, then Right rotate on G, recolor Z→BLACK, G→RED
```

**Case 3c (RR):** Mirror of 3a — left rotate on G.
**Case 3d (RL):** Mirror of 3b — right rotate on P, left rotate on G.

### 4.5 Red-Black Insertion Trace

Insert: **10, 20, 30, 15**

```
Insert 10:
  10(BLACK)        ← Root, Case 0: make BLACK

Insert 20:
  10(BLACK)        ← P is BLACK, Case 1: no fix needed
    \
    20(RED)

Insert 30:
  10(BLACK)        ← 20 is RED, U(10's right NIL) is BLACK → Case 3a (RR)
    \              ← Left rotate on 10
    20(RED)
      \
      30(RED)

After fix:
    20(BLACK)
   /        \
10(RED)   30(RED)   ← Valid Red-Black Tree ✓

Insert 15:
      20(BLACK)
     /        \
  10(RED)    30(RED)
    \
    15(RED)        ← Red-Red violation: P(10) is RED

    Check: U = 30(RED) → Case 2: recolor P and U to BLACK, G to RED

After Case 2 recolor:
      20(RED)       ← G is now RED (may conflict)
     /        \
  10(BLACK)  30(BLACK)
    \
    15(RED)

    Check: 20 is root → Case 0: recolor to BLACK

Final valid Red-Black tree:
      20(BLACK)
     /        \
  10(BLACK)  30(BLACK)
    \
    15(RED)

Properties verified: ✓ Root black, ✓ No consecutive reds, ✓ Same black-height (2)
```

### 4.6 AVL vs Red-Black Tree

| Dimension | AVL Tree | Red-Black Tree |
|---|---|---|
| Balance strategy | Strict (|bf| ≤ 1) | Relaxed (no consecutive reds) |
| Height bound | h ≤ 1.44 log₂(N+2) | h ≤ 2 log₂(N+1) |
| Lookup | Faster (more balanced) | Slightly slower |
| Insert/Delete | Slower (more rotations) | Faster (fewer rotations) |
| Rotations per insert | Up to 2 | Up to 2 (color flips more) |
| Rotations per delete | Up to O(log N) | Up to 3 |
| Extra storage | Balance factor (int) | Color bit |
| Use case | Read-heavy workloads | Write-heavy workloads |
| Typical in | In-memory DB indices | Linux kernel, Java TreeMap, C++ map/set |

---

## 5. AA Tree

### 5.1 Definition

An **AA Tree** (Arne Andersson, 1993) is a simplified Red-Black tree that eliminates half of the rotation cases by enforcing an additional constraint: **only right children may be red**.

### 5.2 Properties

```
1. Every node is either RED or BLACK
2. Root is BLACK
3. NIL leaves are BLACK
4. No RED node has a RED left child
5. No RED node has a RED right sibling (simplified: no consecutive reds)
   — In practice: only horizontal RIGHT red links allowed
6. Same black-height condition as Red-Black tree
```

**Level (instead of black-height):** Each node stores a `level` number.
- Leaf nodes have level = 1
- Red nodes are at the same level as their parent
- Black nodes are one level higher than their children

### 5.3 Operations: skew() and split()

The AA tree uses two key operations instead of the 4-6 rotation cases of Red-Black.

**`skew()` — Eliminates left horizontal red links:**
```
Before:              After (Right rotate):
   X(level=L)         Y(level=L)
  /       ──►        /   \
Y(RED)   Z          a     X(RED)
  a  b                    / \
                         b   Z
```
When a RED node has a RED left child, right-rotate.

**`split()` — Eliminates consecutive right horizontal red links:**
```
Before:              After (Left rotate + level increment):
   X(level=L)               Y(level=L+1)
  /   \                    /   \
 a    Y(RED)       ──►   X     Z(RED)
      /   \              / \     / \
     b   Z(RED)         a   b   c   d
```
When two consecutive RED right links exist, left-rotate and increment the middle node's level.

### 5.4 AA Tree Insertion Algorithm

```
Algorithm AA_Insert(root, key):
  if root == NIL:
      return new_node(key)     // level = 1, color = RED

  if key < root.key:
      root.left = AA_Insert(root.left, key)
  else if key > root.key:
      root.right = AA_Insert(root.right, key)
  else:
      return root              // duplicate, no change

  // Fix violations on way up
  root = skew(root)
  root = split(root)

  return root
```

### 5.5 AA Tree Deletion

1. Perform standard BST deletion
2. Decrement level if necessary
3. Call `skew()` and `split()` on the path up

### 5.6 AA Tree vs Red-Black Tree

| Dimension | AA Tree | Red-Black Tree |
|---|---|---|
| Rotation cases | 2 (skew + split) | 6-8 (4 rotation types + color flips) |
| Code complexity | Simpler | More complex |
| Height | Slightly taller | Slightly shorter |
| Performance | Comparable | Comparable |
| Use case | Educational, simple implementations | Production systems |

---

## 6. K-dimensional Tree (K-d Tree)

### 6.1 Definition

A **K-d Tree** (Bentley, 1975) is a **space-partitioning data structure** for organizing points in **k-dimensional space**. Useful for multi-dimensional search (nearest neighbor, range search).

### 6.2 Construction

**Splitting rule:** At each level, split along a different dimension in round-robin order.

```
Construction algorithm:
1. If point set is empty, return NIL
2. Select splitting dimension d = depth mod k
3. Find median of points along dimension d
4. Create node with median point
5. Recursively build:
     left = build(subset with points < median along dimension d)
     right = build(subset with points > median along dimension d)
6. Return node
```

**Example — 2-d Tree Construction:**

```
Points: (3,6), (2,2), (1,8), (5,7), (7,5), (8,1), (4,4)

Step 1: depth=0, dim=0 (x-coordinate)
  Sort by x: (1,8), (2,2), (3,6), (4,4), (5,7), (7,5), (8,1)
  Median: (4,4) — root node
  Left half (x<4):  (1,8), (2,2), (3,6)
  Right half (x>4): (5,7), (7,5), (8,1)

Step 2: depth=1, dim=1 (y-coordinate)
  Left subtree — sort by y: (2,2), (3,6), (1,8)
    Median: (3,6) — left child of root
    Left-L: (2,2), Right-L: (1,8)
  Right subtree — sort by y: (8,1), (7,5), (5,7)
    Median: (7,5) — right child of root
    Left-R: (5,7), Right-R: (8,1)

Step 3: depth=2, dim=0 (x-coordinate)
  Continue recursively...

Resulting 2-d Tree:
                (4,4)
              /       \
          (3,6)       (7,5)
          /   \       /   \
       (2,2) (1,8) (5,7) (8,1)

Space partitioning visualization:
  y
  |
  8│      (1,8)         ← x=4 wall
  7│           (5,7)
  6│ (3,6)                    y=7 wall (right)
  5│      (7,5)         ← y=6 wall (left)
  4│ (4,4)
  3│
  2│ (2,2)                       y=2 wall (left)
  1│                (8,1)   ← y=1 wall (right)
   └──────────────────────────→ x
     1 2 3 4 5 6 7 8
```

### 6.3 Nearest Neighbor Search (Concept)

```
Algorithm KdTree_NNS(root, target, best):
  if root == NIL: return best

  // 1. Check if current node is closer
  if distance(root, target) < distance(best, target):
      best = root

  // 2. Recursively search the "closer" subtree
  dim = appropriate splitting dimension
  if target[dim] < root.point[dim]:
      best = NNS(root.left, target, best)
  else:
      best = NNS(root.right, target, best)

  // 3. Check if we need to search the OTHER subtree
  //    (possible if splitting plane is within current best distance)
  if |target[dim] - root.point[dim]| < distance(best, target):
      if target[dim] < root.point[dim]:
          best = NNS(root.right, target, best)
      else:
          best = NNS(root.left, target, best)

  return best
```

**Key insight:** The "other side" check is what makes K-d Trees efficient — it prunes entire regions of space.

**Time Complexity:**
- Construction: O(kN log N) worst-case
- Insert: O(log N) average
- NN Search: O(log N) average, O(N) worst-case
- Range search: O(N^(1-1/k) + r)

### 6.4 Applications of K-d Trees

| Application | Dimension | Description |
|---|---|---|
| Color quantization | 3 | (R, G, B) — find nearest palette color |
| Image compression | 3 | Cluster similar colors |
| Computational geometry | 2/3 | Range queries on points |
| Database indexing | k | Multi-attribute indexing |
| Robot motion planning | 2/3/6 | Nearest obstacle check |

---

## 7. Splay Tree

### 7.1 Definition

A **Splay Tree** (Sleator and Tarjan, 1985) is a **self-adjusting BST** where every accessed element is **splayed** (moved to the root) through a series of rotations. It provides **amortized O(log N)** performance.

**Key idea:** Recently accessed elements are near the root → future accesses faster.

### 7.2 Splaying Operations

Splaying moves a node `X` to the root through one of three operations, applied repeatedly:

#### 7.2.1 Zig (Single Rotation)

**Case:** `X` is a child of the root `P`.

```
       P                        X
      / \                      / \
     X   C      ──►           A   P
    / \                          / \
   A   B                        B   C
```

**Mirror (Zag):**
```
   P                              X
  / \                            / \
 A   X          ──►             P   C
    / \                        / \
   B   C                      A   B
```

#### 7.2.2 Zig-Zig (Two Single Rotations)

**Case:** `X` and `P` are both left children (or both right children). Rotate P first, then X.

```
       G                          X
      / \                        / \
     P   D                      A   P
    / \                            / \
   X   C         ──►              B   G
  / \                                / \
 A   B                              C   D
```

#### 7.2.3 Zig-Zag (Double Rotation)

**Case:** `X` is a right child of `P`, and `P` is a left child of `G` (or vice versa). Rotate X twice.

```
       G                          X
      / \                        / \
     P   D                      P   G
    / \                        / \ / \
   A   X                      A  B C  D
      / \
     B   C
```

### 7.3 Splay Tree Search

```
Algorithm Splay_Search(root, key):
  // Standard BST search
  // Splay the found node (or last visited node)

  if root == NIL or root.key == key:
      return root

  if key < root.key:
      if root.left == NIL:
          return root
      // Zig-Zig or Zig-Zag
      root = appropriate rotation
      return Splay_Search(root, key)
  else:
      // Symmetric for right side
```

### 7.4 Splay Tree Insert

```
Algorithm Splay_Insert(root, key):
  // Standard BST insertion
  // Splay the new node to root

  node = new Node(key)
  if root == NIL:
      root = node
      return root

  // Split tree at root into left/right
  // based on comparison with key
  // Make 'node' the new root

  return node
```

### 7.5 Amortized Analysis (Concept)

**Amortized O(log N)** means the average cost per operation over any sequence of operations is O(log N), even if individual operations can be O(N).

**Potential function method:**
- Define Φ(T) = sum of ranks of all nodes (rank = log₂(size of subtree))
- Each splaying operation changes potential by O(log N)
- Total amortized cost = actual cost + ΔΦ = O(log N)

**Key result:** A sequence of `m` operations on a splay tree with `n` nodes takes O(m × log n) time.

### 7.6 Splay Tree vs Other BSTs

| Dimension | Splay Tree | AVL | Red-Black |
|---|---|---|---|
| Balance guarantee | Amortized O(log N) | Strict O(log N) | Strict O(log N) |
| Worst-case single op | O(N) | O(log N) | O(log N) |
| Extra storage per node | None | Balance factor | Color bit |
| Self-adjusting | Yes (splays on access) | No | No |
| Cache friendliness | Good (hot items at root) | Poor | Medium |
| Implementation | Simple | Moderate | Complex |
| Applications | Cache, GC, data compression | DB indices | Language runtimes |

### 7.7 Applications of Splay Trees

- **Cache implementation** — frequently accessed items at root
- **Garbage collection** — Cheney's algorithm uses splay trees
- **Data compression** — splay tree for adaptive Huffman coding
- **Network routing** — recently used routes accessed quickly
- **Memory allocators** — managing free blocks

---

## 8. Case Study: Keyword Search in a Document Using OBST

### 8.1 Problem Statement

Given a document (e.g., a book, research paper, or codebase), build a search index that minimizes the **expected lookup time** for keyword queries. Keywords have different frequencies — some are searched frequently, others rarely.

### 8.2 Why OBST for Keyword Search?

| Requirement | How OBST Fulfills It |
|---|---|
| Known keyword frequencies | Document analysis yields frequency distribution |
| Minimize average search cost | OBST minimizes expected search cost |
| Static keyword set | Document keywords are fixed before indexing |
| Optimal for skewed access | Frequent keywords placed near root |
| O(N) space | OBST uses O(N) storage for N keys |

### 8.3 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOCUMENT INDEXING PIPELINE                    │
└─────────────────────────────────────────────────────────────────┘

                         ┌──────────────────┐
                         │  RAW DOCUMENT    │
                         │  (Text File)     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  TOKENIZATION    │
                         │  (Word Splitting)│
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  STOPWORD FILTER  │
                         │  (Remove the, a, │
                         │   an, is, etc.)   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  FREQUENCY COUNT  │
                         │  (pᵢ = freqᵢ/N)  │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    OBST BUILD    │
                         │ (DP Construction)│
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   SEARCH INDEX   │
                         │ (Min-cost BST)   │
                         └──────────────────┘
```

### 8.4 Worked Example

**Document excerpt:** "The data structure data and algorithm data analysis data"

**Step 1 — Tokenize and count frequencies:**
```
Word     | Frequency | Probability (pᵢ)
─────────┼───────────┼──────────────────
data     | 4         | 4/7 ≈ 0.571
and      | 1         | 1/7 ≈ 0.143
the      | 1         | 1/7 ≈ 0.143 (stopword, excluded)
analysis | 1         | 1/7 ≈ 0.143
structure| 1         | 1/7 ≈ 0.143

After stopword removal (excluding "the"):
Word      | Frequency | pᵢ
──────────┼───────────┼─────
data      | 4         | 0.571
and       | 1         | 0.143
analysis  | 1         | 0.143
structure | 1         | 0.143
```

**Step 2 — Sort keys alphabetically:**
```
k₁ = "analysis" (p=0.143)
k₂ = "and"      (p=0.143)
k₃ = "data"     (p=0.571)
k₄ = "structure" (p=0.143)
```

**Step 3 — Build OBST (simplified for illustration):**

With all dummy probabilities equal (q = 0.05 each), the DP yields root `k₃` ("data") since it has the highest probability.

```
Optimal Search Tree:
           ┌─────────────┐
           │    data     │
           │  (p=0.571)  │ ← Most frequent at root
           └──────┬──────┘
                  │
         ┌────────┴────────┐
         │                 │
   ┌─────┴─────┐     ┌────┴────┐
   │   and     │     │structure│
   │ (p=0.143) │     │(p=0.143)│
   └─────┬─────┘     └─────────┘
         │
    ┌────┴────┐
    │analysis │
    │(p=0.143)│
    └─────────┘

Expected search cost = 1×0.571 + 2×0.143 + 3×0.143 + 3×0.143
                     = 0.571 + 0.286 + 0.429 + 0.429
                     = 1.715
```

**Comparison with regular BST (insertion order = frequency order):**
```
"data" → "and" → "analysis" → "structure"

Would give:
       data
      /
    and
   /
analysis
   \
   structure

Expected cost = 1×0.571 + 2×0.143 + 3×0.143 + 4×0.143 = 1.715 + 0.143 = 1.858
```

OBST saves **~8%** expected cost compared to the naive frequency-ordered insertion.

### 8.5 Benefits of OBST for Keyword Search

| Benefit | Detail |
|---|---|
| **Minimized search cost** | Most frequent keywords have shortest paths |
| **Fixed index structure** | Suitable for read-only search indices |
| **Predictable performance** | Upper bound on expected search cost is known |
| **Space efficient** | No extra balancing info (unlike AVL/RB) |

### 8.6 Limitations

| Limitation | Mitigation |
|---|---|
| O(N³) construction time | Knuth optimization → O(N²) |
| Static — cannot easily add new keywords | Rebuild periodically |
| Requires accurate frequency data | Estimate from document corpus |
| Unsuccessful search costs included | Dummy key probabilities needed |

---

## 9. Comparison Tables

### 9.1 All Tree Types Summary

| Tree Type | Balance Strategy | Height | Insert | Delete | Lookup | Extra Space |
|---|---|---|---|---|---|---|
| BST (unbalanced) | None | O(N) worst | O(N) | O(N) | O(N) | None |
| OBST | Probabilistic | O(log N) expected | — (static) | — (static) | O(log N) | O(N²) DP tables |
| AVL | Strict | 1.44 log N | O(log N) | O(log N) | O(log N) | int (bf) |
| Red-Black | Relaxed | 2 log N | O(log N) | O(log N) | O(log N) | 1 bit (color) |
| AA | Simplified RB | 2 log N | O(log N) | O(log N) | O(log N) | int (level) |
| Splay | Amortized | O(N) worst | O(log N)* | O(log N)* | O(log N)* | None |
| K-d Tree | Spatial | O(N) worst | O(log N) | O(log N) | O(log N) avg | k-dim point |

*\* Amortized bound*

### 9.2 Self-Balancing Trees Comparison

| Feature | AVL | Red-Black | Splay | AA |
|---|---|---|---|---|
| Strictness | Most strict | Moderate | Self-adjusting | Moderate |
| Rotations/insert | ≤ 2 | ≤ 2 | Up to tree height | ≤ 2 |
| Rotations/delete | O(log N) | ≤ 3 | Up to tree height | ≤ 2 |
| Worst-case lookup | O(log N) | O(log N) | O(N) | O(log N) |
| Amortized all ops | O(log N) | O(log N) | O(log N) | O(log N) |
| Memory overhead | Highest | Moderate | None | Moderate |
| Code complexity | Medium | High | Low | Low |

### 9.3 When to Use What

| Requirement | Recommended Tree |
|---|---|
| Read-heavy, need fastest lookup | AVL |
| Write-heavy, balanced workload | Red-Black |
| Simple to implement, balanced | AA |
| Hot/cold data, caching | Splay |
| Multi-dimensional search | K-d Tree |
| Known frequencies, static set | OBST |
| Building a compiler symbol table | OBST or Hash Table |

---

## 10. Formula & Complexity Reference Sheet

### DP Recurrence (OBST)

```
w[i][j]  = w[i][j-1] + pⱼ + qⱼ
cost[i][j] = min(cost[i][k-1] + cost[k+1][j]) + w[i][j]
```

### AVL Balance Factor

```
bf(node)  = height(left) - height(right)
AVL Invariant: |bf| ≤ 1
```

### Red-Black Properties (PUG Mnemonic)

```
P — Parent is BLACK? Done.
U — Uncle is RED?   Flip colors.
G — Uncle is BLACK? Rotate + recolor.
```

### AA Tree Operations

```
skew()  → fix left horizontal red (right rotate)
split() → fix consecutive right reds (left rotate + level++)
```

### Complexity Table

| Data Structure | Construction | Search | Insert | Delete | Space |
|---|---|---|---|---|---|
| **BST (avg)** | O(N log N) | O(log N) | O(log N) | O(log N) | O(N) |
| **BST (worst)** | O(N²) | O(N) | O(N) | O(N) | O(N) |
| **OBST** | O(N³) / O(N²)* | O(log N) | — | — | O(N) |
| **AVL** | O(N log N) | O(log N) | O(log N) | O(log N) | O(N) |
| **Red-Black** | O(N log N) | O(log N) | O(log N) | O(log N) | O(N) |
| **AA** | O(N log N) | O(log N) | O(log N) | O(log N) | O(N) |
| **Splay** | O(N log N) | O(log N)† | O(log N)† | O(log N)† | O(N) |
| **K-d Tree** | O(kN log N) | O(log N) avg | O(log N) | O(log N) | O(kN) |

*\* With Knuth optimization — O(N²)*  
*† Amortized over sequence of operations*

---

## 11. Expected Exam Questions (Pattern Analysis)

| Question Type | Marks | Frequency |
|---|---|---|
| Explain symbol table operations with static/dynamic comparison | 4-6 | High |
| Construct OBST for given keys/probabilities (full DP trace) | 6-8 | Very High |
| Explain AVL rotations with diagrams and trace insertion | 6-8 | Very High |
| Write and trace Red-Black tree insertion with properties | 6-8 | High |
| Explain AA tree — skew() and split() operations | 4 | Medium |
| Construct K-d Tree for given points and explain NN search | 4-6 | Medium |
| Explain splay tree zig/zig-zig/zig-zag operations | 4 | Medium |
| Compare AVL vs Red-Black tree | 4 | High |
| Case study: keyword search using OBST | 4 | Medium |
| Compare static vs dynamic symbol table | 4 | High |
| Compare any two search trees (table) | 4 | High |
| Explain properties of Red-Black tree | 4 | Medium |
| Balance factor concept with AVL example | 2-4 | Medium |
| Show amortized analysis concept for splay tree | 4 | Low |

**Command Words Used:**
- **Define / State** (L1) — 2–4 marks — symbol table, balance factor, black-height
- **Explain / Describe** (L2) — 4 marks — properties, rotations, operations
- **Apply / Trace / Construct** (L3) — 6–8 marks — OBST trace, AVL insertion, RB insertion
- **Compare / Differentiate** (L4) — 4 marks — AVL vs RB, static vs dynamic
- **Analyze** (L4-L5) — 4–6 marks — case study, amortized analysis

---

## 12. Rapid Revision — One Page Summary

### TOP 5 DEFINITIONS

1. **Symbol Table:** Compiler DS mapping identifiers → attributes; supports insert/lookup/delete
2. **OBST:** BST minimizing expected search cost using DP recurrence `cost = min + w`
3. **AVL Tree:** Self-balancing BST with |bf| ≤ 1; 4 rotations (LL, RR, LR, RL)
4. **Red-Black Tree:** Self-balancing BST with 5 color properties; height ≤ 2 log N
5. **Splay Tree:** Self-adjusting BST — accessed elements move to root via splaying

### TOP 5 KEY POINTS

1. **OBST DP:** `cost[i][j] = min(cost[i][k-1] + cost[k+1][j]) + w[i][j]` — O(N³) time, O(N²) space
2. **AVL 4 rotations:** LL→RightRotate, RR→LeftRotate, LR→LeftThenRight, RL→RightThenLeft
3. **RB 5 properties:** Root black, no consecutive reds, same black-height
4. **RB Insertion 3 cases:** P-BLACK(done), U-RED(flip), U-BLACK(rotate+recolor)
5. **Splay amortized O(log N):** Individual ops can be O(N), but m ops = O(m log N)

### QUICK COMPARISONS

| A | B | Key Difference |
|---|---|---|
| Static ST | Dynamic ST | Fixed array vs tree/hash |
| OBST | BST | DP + probabilities vs arbitrary insert |
| AVL | RB | Strict (|bf|≤1) vs relaxed; faster lookups vs faster writes |
| RB | AA | 6+ cases vs 2 ops (skew+split) |
| Splay | AVL | Self-adjusting vs fixed; amortized vs worst-case |
| K-d Tree | BST | k-dim space vs 1-dim; alternating split dimensions |

### EXAM PREDICTION

**Most likely 8-mark question:** "Construct OBST for given keys with frequencies using DP, showing cost/weight/root tables."  
**Most likely 6-mark question:** "Insert keys into an AVL tree showing rotations at each step."  
**Most likely 4-mark question:** "Compare AVL tree and Red-Black tree." or "Compare static and dynamic symbol table."

### MUST-KNOW

OBST DP trace, AVL 4 rotations with diagrams, RB 5 properties + PUG insertion cases, AA skew/split, K-d tree construction, Splay zig/zig-zig/zig-zag, Symbol table scope management

### MNEMONICS

**AVL Rotations (direction of imbalance):**
- "LL → Right" — Left-heavy needs Right rotation (opposites!)
- "RR → Left" — Right-heavy needs Left rotation
- "LR → Double (LR)" — First Left on child, then Right on parent
- "RL → Double (RL)" — First Right on child, then Left on parent

**Red-Black Insertion (PUG):**
- **P** is BLACK → OK
- **U** is RED → Recolor (flip P, U, G)
- **G**(randparent) uncle is BLACK → Rotate + recolor

**OBST DP:** "Try every root, add weight" — `min(Left + Right) + w`

**Splay:** "Access = Root" — every accessed node becomes the new root

---

## 13. Self-Test Questions

**Q1:** What are the three basic operations supported by a symbol table?  
*Answer: Insert, Lookup (Search), Delete*

**Q2:** In the OBST recurrence `cost[i][j] = min(cost[i][k-1] + cost[k+1][j]) + w[i][j]`, what does `w[i][j]` represent?  
*Answer: Sum of probabilities of all keys and dummy keys in range [i..j]*

**Q3:** A node in an AVL tree has balance factor +2 and its left child has balance factor −1. Which rotation(s) are needed?  
*Answer: LR rotation — left rotate on left child, then right rotate on the unbalanced node*

**Q4:** What is the maximum possible height of a Red-Black tree with 1000 internal nodes?  
*Answer: h ≤ 2 × log₂(1000+1) ≈ 2 × 10 = 20*

**Q5:** What are the two operations used in AA tree maintenance?  
*Answer: skew() — eliminates left red links; split() — eliminates consecutive right red links*

**Q6:** In a 2-d Tree, which dimension is used for splitting at depth = 3?  
*Answer: depth mod k = 3 mod 2 = 1 → y-coordinate (round-robin)*

**Q7:** Name the three splay operations. Which one is used when the node is a direct child of the root?  
*Answer: Zig (direct child of root), Zig-Zig (same-side grandchild), Zig-Zag (opposite-side grandchild)*

**Q8:** An OBST has keys with probabilities 0.5, 0.3, 0.2. Why might the OBST root NOT be the key with highest probability?  
*Answer: It CAN be the highest probability key as root, but the actual selection depends on the DP algorithm considering subtree costs — though in most cases the highest probability key will be the root.*

**Q9:** Compare the number of rotations needed for insertion in AVL vs Red-Black tree.  
*Answer: AVL ≤ 2 rotations, RB ≤ 2 rotations (but RB does more color flips). Both are O(1) rotations per insert.*

**Q10:** How does a Splay Tree achieve amortized O(log N) despite O(N) worst-case operations?  
*Answer: Each splay operation reduces the depth of nodes along the access path. The potential function (sum of log of subtree sizes) ensures the amortized cost is O(log N).*

**Q11:** Why are OBST and hash tables both used for symbol tables?  
*Answer: Hash tables give O(1) average lookup but have overhead (collision handling). OBST gives O(log N) guaranteed expected cost with no hash function overhead. OBST is better for small-to-medium static keyword sets with known frequencies.*

**Q12:** Trace AVL rotations for inserting 10, 20, 30, 40 in order.  
*Check your answer: After 10→20→30, RR imbalance → left rotate → 20 is root. Insert 40 → 30 has bf=-1, 20 has bf=-1 → OK. Final tree: 20(bf=-1), left=10(0), right=30(bf=-1), right.right=40(0)*

---

## 14. Learning Acceleration Footer

| Item | Details |
|---|---|
| **Spaced Repetition Schedule** | D1 | D2 | D4 | D8 | D16 |
| **Top 3 Mnemonics** | "LL → Right, RR → Left" (AVL rotations); "PUG" — Parent/Uncle/Grandparent (RB insertion); "skew kills left reds, split kills double reds" (AA tree) |
| **Self-Test Questions** | See Section 13 above |
| **Feynman Challenge** | "Explain in 3 sentences: Why does OBST use Dynamic Programming while AVL uses rotations?" |
| **Cross-Link** | Unit I (BST, binary search) → Unit IV (balanced search trees); Unit II (DP basics) → OBST (DP for trees); Unit III (graph algorithms) → DP pattern comparison |
| **Bloom Level Reached** | L4 (Analyze) — Push to L5 by evaluating: "Which balanced tree would you use for a real-time trading system where writes = reads? Justify." |
| **Exam Confidence Checklist** | [ ] Can trace OBST with 4 keys [ ] Can draw all 4 AVL rotations [ ] Can state RB 5 properties [ ] Can explain skew/split [ ] Can construct K-d Tree [ ] Can show zig/zig-zig/zig-zag |

---

*End of Unit IV — Search Trees Notes*
