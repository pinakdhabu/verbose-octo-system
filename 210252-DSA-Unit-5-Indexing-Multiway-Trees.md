# 210252: Data Structures and Algorithms — Unit V: Indexing and Multiway Trees

**University:** Savitribai Phule Pune University (SPPU)  
**Program:** S.E. Computer Engineering (2019 Pattern)  
**Semester:** IV  
**Duration:** 07 Hours  
**CO Mapping:** CO2, CO3, CO5  
**Exam Weightage:** ~12–16 marks (End Sem) + ~4–6 marks (Mid Sem)

---

## Syllabus (Verbatim)

> Indexing and Multiway Trees — Indexing, indexing techniques — primary, secondary, dense, sparse. Multiway search trees. B-Tree — insertion, deletion. B+Tree — insertion, deletion, use of B+ tree in Indexing. Trie Tree.
> Case Study: Heap as a Priority Queue
> COs: CO2, CO3, CO5 | Duration: 07 Hours

---

## CO—Bloom Mapping for Unit V

| Topic | CO | Bloom Level |
|---|---|---|
| Indexing Concepts (primary, secondary, dense, sparse) | CO2 | L2 — Understand |
| Multiway Search Trees | CO2 | L2 — Understand |
| B-Tree — Insertion & Deletion | CO3 | L3 — Apply |
| B+Tree — Insertion & Deletion | CO3 | L3 — Apply |
| B+Tree in Indexing | CO5 | L4 — Analyze |
| Trie Tree — Insertion & Search | CO3 | L3 — Apply |
| Heap as Priority Queue (Case Study) | CO5 | L4 — Analyze |

---

## 1. Indexing

### 1.1 What is Indexing?

**Definition:** Indexing is a data structure technique used to **locate data records quickly** without scanning the entire file. It is analogous to the index of a book — you go to the index page, find the topic, and jump directly to the page number.

**Why is indexing needed?**
- Sequential file scan is O(N) — impractical for large databases
- Index reduces search cost to O(log N) or even O(1)
- Enables fast retrieval, sorting, and range queries

```
Without Index:                    With Index:
┌────┬────┬────┬────┬────┐        ┌────┬────┐        ┌────┬────┬────┬────┬────┐
│ R1 │ R2 │ R3 │ R4 │ R5 │        │ K1 │ P1 │        │ R1 │ R2 │ R3 │ R4 │ R5 │
├────┼────┼────┼────┼────┤        ├────┼────┤        ├────┼────┼────┼────┼────┤
│ .. │ .. │ .. │ .. │ .. │        │ K3 │ P3 │        │ .. │ .. │ .. │ .. │ .. │
├────┼────┼────┼────┼────┤        ├────┼────┤        ├────┼────┼────┼────┼────┤
│ .. │ .. │ .. │ .. │ .. │        │ K5 │ P5 │        │ .. │ .. │ .. │ .. │ .. │
└────┴────┴────┴────┴────┘        └────┴────┘        └────┴────┴────┴────┴────┘
  Data File (unordered)             Index File           Data File (ordered)
                              (Key, Pointer) pairs
```

**Index structure:** An index file consists of `<key, pointer>` pairs. The pointer gives the location of the actual data record.

### 1.2 Types of Indexing

#### 1.2.1 Primary Index

**Definition:** A primary index is built on the **ordering key field** (the field that determines the physical order of records in the file). It is a **sparse** index.

**Characteristics:**
- Built on **ordered file** (sorted on key field)
- One index entry **per block** (not per record)
- **Sparse** — fewer entries than records
- The key field is usually the **primary key** (unique)

```
Data File (sorted on RollNo):

Block 1:  ┌──────┬─────────┐
          │ 101  │  Alice  │
          │ 102  │  Bob    │
          │ 103  │  Carol  │
          └──────┴─────────┘
Block 2:  ┌──────┬─────────┐
          │ 104  │  David  │
          │ 105  │  Eve    │
          │ 106  │  Frank  │
          └──────┴─────────┘
Block 3:  ┌──────┬─────────┐
          │ 107  │  Grace  │
          │ 108  │  Henry  │
          │ 109  │  Iris   │
          └──────┴─────────┘

Primary Index (Sparse — one per block):
┌──────┬─────────┐
│ 101  │ Blk1Ptr │
│ 104  │ Blk2Ptr │
│ 107  │ Blk3Ptr │
└──────┴─────────┘

To find RollNo 105:
  1. Search index for largest key ≤ 105 → 104
  2. Follow pointer to Block 2
  3. Scan Block 2 sequentially
```

**Exam Tip:** Primary index is **always sparse** because the data file is ordered and one index entry per block suffices.

#### 1.2.2 Secondary Index

**Definition:** A secondary index is built on a **non-ordering key field** (a field that does not determine physical order). It is a **dense** index.

**Characteristics:**
- Built on any **non-ordering field**
- One index entry **per record**
- **Dense** — every record has an entry
- Provides alternate access paths

```
Data File (unordered on Name field):

┌──────┬─────────┐
│ 105  │  Eve    │
│ 101  │  Alice  │
│ 108  │  Henry  │
│ 103  │  Carol  │
│ 106  │  Frank  │
└──────┴─────────┘

Secondary Index on Name (Dense — one per record):
┌─────────┬─────────┐
│ Alice   │ Ptr_101 │
│ Carol   │ Ptr_103 │
│ Eve     │ Ptr_105 │
│ Frank   │ Ptr_106 │
│ Henry   │ Ptr_108 │
└─────────┴─────────┘

To find "Carol":
  1. Search secondary index (sorted on Name) — binary search
  2. Follow pointer to record 103
```

**Secondary index on non-unique field:**
If the indexing field allows duplicates, use a **bucket** (list of pointers per key value) or **overflow** technique.

```
Secondary Index on Dept (with duplicates):
┌─────────┬──────────────────┐
│ CS      │ Ptr_101 → Ptr_107│
│ EE      │ Ptr_103          │
│ ME      │ Ptr_105 → Ptr_108│
└─────────┴──────────────────┘
```

#### 1.2.3 Dense vs Sparse Index

| Dimension | Dense Index | Sparse Index |
|---|---|---|
| **Definition** | Index entry for **every record** | Index entry for **each block** (or page) |
| **Number of entries** | Same as number of records | Same as number of blocks |
| **Space** | Larger (O(N)) | Smaller (O(N/blocksize)) |
| **Search time** | Faster — direct pointer to record | May need sequential scan within block |
| **Requires ordered data?** | No | Yes (data must be sorted on key) |
| **Example** | Secondary index | Primary index |
| **Lookup cost** | O(log N) to index + O(1) to record | O(log B) to index + O(blocksize) scan |
| **Update cost** | Higher (update index per record) | Lower (update index only when block changes) |

**Exam Tip:** A 4-mark question on dense vs sparse indexing is very common. Memorize the comparison table.

```
Visual Comparison:

Dense Index:                   Sparse Index:
Keys      Pointers             Keys      Pointers
┌──────┬─────────┐            ┌──────┬─────────┐
│ 101  │ → rec1  │            │ 101  │ → blk1  │
│ 102  │ → rec2  │            │ 104  │ → blk2  │
│ 103  │ → rec3  │            │ 107  │ → blk3  │
│ 104  │ → rec4  │            │ 110  │ → blk4  │
│ 105  │ → rec5  │            └──────┴─────────┘
│ 106  │ → rec6  │            Every block is represented,
│...   │         │            not every record.
└──────┴─────────┘
Every record is represented.
```

#### 1.2.4 Clustering Index

**Definition:** A clustering index is built on an **ordered** file where the key field is **non-unique** (multiple records share the same key value). One index entry per **distinct key value**.

```
Data File (sorted on Dept):

┌──────┬─────────┬────────┐
│ 101  │  Alice  │  CS    │
│ 102  │  Bob    │  CS    │
│ 103  │  Carol  │  CS    │
│ 104  │  David  │  EE    │
│ 105  │  Eve    │  EE    │
│ 106  │  Frank  │  ME    │
└──────┴─────────┴────────┘

Clustering Index on Dept:
┌────────┬──────────────────┐
│ CS     │ → blk1            │
│ EE     │ → blk2            │
│ ME     │ → blk3            │
└────────┴──────────────────┘
```

### 1.3 Summary of Index Types

| Index Type | Key Field | Density | Ordering of Data | Uniqueness |
|---|---|---|---|---|
| Primary | Ordering key field | Sparse | Ordered | Unique |
| Clustering | Ordering non-key field | Sparse (per distinct key) | Ordered | Non-unique |
| Secondary | Non-ordering field | Dense | Unordered | Unique or Non-unique |

---

## 2. Multiway Search Tree

### 2.1 Definition

A **Multiway Search Tree (m-way Search Tree)** is a tree in which each node can have **at most m children** and **at most (m−1) keys**. It is a generalization of the binary search tree (which is a 2-way tree).

```
Binary Tree (2-way):           3-way Tree:
      ┌───┐                      ┌───────┐
      │ 50│                      │ 30 70 │
     ╱    ╲                    ╱    │    ╲
  ┌───┐   ┌───┐            ┌────┐ ┌────┐ ┌────┐
  │30 │   │70 │            │10 20│ │40  │ │80 90│
  └───┘   └───┘            └────┘ └────┘ └────┘
```

### 2.2 Properties of an m-way Search Tree

1. Each node has **at most m children**
2. Each node (except root) has **at least ceil(m/2) children** — for balanced variants (not strictly required for basic m-way tree)
3. A node with `k` children contains `(k−1)` keys
4. Keys in each node are stored in **sorted order**: `K₁ < K₂ < ... < Kₖ₋₁`
5. For a node with keys K₁, K₂, ..., Kₖ₋₁:
   - Subtree between Kᵢ and Kᵢ₊₁ contains keys in range `(Kᵢ, Kᵢ₊₁)`
   - Leftmost subtree contains keys `< K₁`
   - Rightmost subtree contains keys `> Kₖ₋₁`

```
Structure of an m-way node:
         ┌────────────────────────────────────────────┐
         │  P₀ │ K₁ │ P₁ │ K₂ │ P₂ │ ... │ Kₓ │ Pₓ   │
         └────────────────────────────────────────────┘
         
         Where:
         - Kᵢ are keys (sorted)
         - Pᵢ are pointers to child subtrees
         - For each i: subtree at Pᵢ contains keys in (Kᵢ, Kᵢ₊₁)
         - Subtree at P₀ contains keys < K₁
         - Subtree at Pₓ contains keys > Kₓ
```

### 2.3 Example: 3-way Search Tree

```
              ┌───────┐
              │ 40 70 │
           ╱     │      ╲
    ┌───────┐ ┌───────┐ ┌────────┐
    │ 20 30 │ │ 50 60 │ │ 80 90  │
    └───────┘ └───────┘ └────────┘
   ╱   │   ╲  ╱   │   ╲  ╱   │    ╲
┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐
│10│ │25│ │35│ │45│ │55│ │65│ │75│ │85│ │95│
└──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘
```

**Key properties illustrated:**
- Root has 2 keys (40, 70) and 3 children
- Internal nodes have up to 2 keys and 3 children
- Leaf nodes have 1 key and 0 children

### 2.4 m-way Tree vs Binary Search Tree

| Dimension | Binary Search Tree | m-way Search Tree |
|---|---|---|
| Children per node | 2 | Up to m |
| Keys per node | 1 | Up to (m−1) |
| Height | O(log₂ N) | O(logₘ N) |
| Space per node | Small | Larger |
| Disk I/O efficiency | Poor (tall) | Better (shorter, bushier) |
| Used for | In-memory data | Disk-based data (databases) |

---

## 3. B-Tree

### 3.1 Definition

A **B-Tree** of **order m** is a balanced m-way search tree with the following properties:

1. **Root** has at least 2 children (if not leaf)
2. **Every non-root internal node** has at least **ceil(m/2)** children (i.e., at least ceil(m/2) − 1 keys)
3. **Every node** has at most **m** children (i.e., at most **m−1** keys)
4. **All leaves** appear at the **same depth** (perfect balance)
5. Keys in each node are **sorted**
6. Pointers in a node with k keys point to subtrees containing keys between those keys

```
B-Tree of order m = 5:

Properties:
  - Max children per node: 5
  - Min children (non-root): ceil(5/2) = 3
  - Max keys per node: 4
  - Min keys per node (non-root): 2
```

### 3.2 Structure of a B-Tree Node

```
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ P₀  │ K₁  │ P₁  │ K₂  │ P₂  │ K₃  │ P₃  │ ... │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
        ↑                                   ↑
    (m-1) keys max                    m pointers max
```

### 3.3 B-Tree Insertion

**Algorithm:**
1. Search for the key in the tree to find the correct **leaf** position
2. If the leaf has space (< m−1 keys), insert the key in **sorted order**
3. If the leaf is full (has m−1 keys), **split**:
   - Find the **median** key
   - Median moves **up** to the parent
   - Left half stays in the current node
   - Right half goes to a **new node**
4. If the parent is also full, split propagates upward
5. If the root splits, create a **new root** — tree height increases by 1

**Full Trace: B-Tree of Order 5 (m=5)**

⇒ Max keys/node = 4, Min keys/node (non-root) = 2

Insert: 10, 20, 30, 40, 50, 60, 70, 80, 90, 25, 35, 55, 65, 75

```
Step 1: Insert 10, 20, 30, 40

  ┌───────────────┐
  │ 10  20  30  40│    ← Root (leaf). Space available (4 < 4? No, =4 is full)
  └───────────────┘

Step 2: Insert 50 (leaf is full → split)

  Leaf: [10, 20, 30, 40] + insert 50 → [10, 20, 30, 40, 50]
  Median = 30 (3rd element in 1-indexed, or middle)
  
  Split:
    Left:  [10, 20]
    Right: [40, 50]
    Median 30 moves up to new root

            ┌───┐
            │ 30│
          ╱       ╲
  ┌─────────┐    ┌─────────┐
  │ 10  20  │    │ 40  50  │
  └─────────┘    └─────────┘

Step 3: Insert 60, 70

            ┌───┐
            │ 30│
          ╱       ╲
  ┌─────────┐    ┌───────────┐
  │ 10  20  │    │ 40  50  60│   ← 60 inserted in right leaf
  └─────────┘    └───────────┘

  Insert 70 → right leaf has [40,50,60,70] (full, 4 keys)

            ┌───┐
            │ 30│
          ╱       ╲
  ┌─────────┐    ┌───────────────┐
  │ 10  20  │    │ 40  50  60  70│   ← full
  └─────────┘    └───────────────┘

Step 4: Insert 80 (right leaf full → split)

  Right leaf: [40, 50, 60, 70] + 80 → [40, 50, 60, 70, 80]
  Median = 60
  
  Split:
    Left:  [40, 50]
    Right: [70, 80]
    Median 60 moves up to root

              ┌───────┐
              │ 30 60 │
           ╱     │      ╲
  ┌─────────┐ ┌───────┐ ┌─────────┐
  │ 10  20  │ │ 40 50 │ │ 70  80  │
  └─────────┘ └───────┘ └─────────┘

Step 5: Insert 90

              ┌───────┐
              │ 30 60 │
           ╱     │      ╲
  ┌─────────┐ ┌───────┐ ┌───────────┐
  │ 10  20  │ │ 40 50 │ │ 70  80  90│
  └─────────┘ └───────┘ └───────────┘

Step 6: Insert 25

  Search path: root → left child (since 25 < 30)
  Left leaf [10, 20] has space → insert → [10, 20, 25]

              ┌───────┐
              │ 30 60 │
           ╱     │      ╲
  ┌────────────┐ ┌───────┐ ┌───────────┐
  │ 10 20 25  │ │ 40 50 │ │ 70  80  90│
  └────────────┘ └───────┘ └───────────┘

Step 7: Insert 35

  Search path: root → middle child (since 30 < 35 < 60)
  Middle leaf [40, 50] has space → insert → ... wait, order: 35 < 40 → insert at position 0

              ┌───────┐
              │ 30 60 │
           ╱     │      ╲
  ┌────────────┐ ┌──────────┐ ┌───────────┐
  │ 10 20 25  │ │ 35 40 50 │ │ 70  80  90│
  └────────────┘ └──────────┘ └───────────┘

Step 8: Insert 55

  Middle leaf [35, 40, 50, 55] → becomes [35, 40, 50, 55] — 4 keys, still has space (max is 4)
  
  Wait — max is 4 keys. 35,40,50,55 = 4 keys = full. Next insertion will split...

Actually let me reconsider. Order m=5 means max keys = m-1 = 4. So [35,40,50] has 3 keys (space for 1 more). Insert 55 → [35,40,50,55] = 4 keys = exactly full.

              ┌───────┐
              │ 30 60 │
           ╱     │      ╲
  ┌────────────┐ ┌──────────────┐ ┌───────────┐
  │ 10 20 25  │ │ 35 40 50 55 │ │ 70  80  90│
  └────────────┘ └──────────────┘ └───────────┘

Step 9: Insert 65

  Search path: root → right child (65 > 60)
  Right leaf [70, 80, 90] has space → insert 65
  
  Wait — keys must be sorted. [70,80,90] with 65 inserted → [65,70,80,90]

              ┌───────┐
              │ 30 60 │
           ╱     │      ╲
  ┌────────────┐ ┌──────────────┐ ┌───────────────┐
  │ 10 20 25  │ │ 35 40 50 55 │ │ 65 70 80 90  │
  └────────────┘ └──────────────┘ └───────────────┘

Step 10: Insert 75 (right leaf is full → split)

  Right leaf: [65, 70, 80, 90] + 75 → [65, 70, 75, 80, 90]
  Median = 75
  
  Split:
    Left:  [65, 70]
    Right: [80, 90]
    Median 75 moves up to root

              ┌──────────┐
              │ 30 60 75 │
           ╱     │     │    ╲
  ┌────────────┐ ┌──────┐ ┌──────┐ ┌────────┐
  │ 10 20 25  │ │35 40 │ │65 70│ │ 80 90 │
  │           │ │50 55 │ │     │ │       │
  └────────────┘ └──────┘ └──────┘ └────────┘
```

**Exam Tip:** For a full 8-mark B-Tree insertion question, you MUST show the tree state at every step (or at least after every split). Without split traces, marks are deducted.

### 3.4 B-Tree Deletion

**Algorithm:**
1. **If key is in a leaf:** remove it. If leaf still has ≥ ceil(m/2)−1 keys, done.
2. **If leaf underflows** (< ceil(m/2)−1 keys):
   - **Borrow** from left or right sibling (redistribute via parent)
   - If no sibling can spare a key → **merge** with a sibling
3. **If key is in an internal node:**
   - Replace with **inorder predecessor** (largest in left subtree) or **inorder successor** (smallest in right subtree) — then delete from leaf
4. Merge may propagate upward
5. If root becomes empty (0 keys), the single child becomes the new root

**Full Trace: B-Tree of Order 5 (m=5)**

Starting tree (after previous insertions):

```
              ┌──────────┐
              │ 30 60 75 │
           ╱     │     │    ╲
  ┌────────────┐ ┌──────┐ ┌──────┐ ┌────────┐
  │ 10 20 25  │ │35 40 │ │65 70│ │ 80 90 │
  │           │ │50 55 │ │     │ │       │
  └────────────┘ └──────┘ └──────┘ └────────┘
```

Properties: m=5, min keys per non-root node = ceil(5/2)-1 = 2

**Case 1: Delete 90 (leaf, no underflow)**

```
  Remove 90 from right leaf [80, 90] → [80]
  
  [80] has 1 key — min is 2! Underflow!
  
  Try borrowing from left sibling [65, 70]:
    Left sibling has 2 keys — can spare 1?
    Wait — min is 2, so left sibling can only spare if it has > 2. It has exactly 2 — cannot borrow.
  
  Merge [65, 70] and [80] with parent key 75:
    Merged node: [65, 70, 75, 80]
    Remove 75 from parent [30, 60, 75] → [30, 60]
    
              ┌──────────────┐
              │   30   60    │
           ╱         │        ╲
  ┌────────────┐ ┌──────┐ ┌──────────────┐
  │ 10 20 25  │ │35 40 │ │65 70 75 80  │
  │           │ │50 55 │ │             │
  └────────────┘ └──────┘ └──────────────┘
```

**Case 2: Delete 55 (leaf, borrow from sibling)**

```
  Remove 55 from [35, 40, 50, 55] → ... wait, [35, 40, 50] has 3 keys
  
  Actually, 55 is in node [35, 40, 50, 55]. Remove 55 → [35, 40, 50] — has 3 keys, min is 2. OK.
  
              ┌──────────────┐
              │   30   60    │
           ╱         │        ╲
  ┌────────────┐ ┌──────┐ ┌──────────────┐
  │ 10 20 25  │ │35 40 │ │65 70 75 80  │
  │           │ │ 50   │ │             │
  └────────────┘ └──────┘ └──────────────┘
```

**Case 3: Delete 35 (leaf underflow, borrow from sibling)**

```
  Node [35, 40, 50] — remove 35 → [40, 50]. Has 2 keys (min = 2). OK.

              ┌──────────────┐
              │   30   60    │
           ╱         │        ╲
  ┌────────────┐ ┌──────┐ ┌──────────────┐
  │ 10 20 25  │ │40 50 │ │65 70 75 80  │
  └────────────┘ └──────┘ └──────────────┘
```

**Case 4: Delete 30 (internal node key)**

```
  Goal: Replace 30 with inorder predecessor (25) or successor (40).
  Replace 30 with 25 (inorder predecessor from left subtree).
  
  Now delete 25 from left leaf [10, 20, 25] → [10, 20]. Has 2 keys. OK.
  
              ┌──────────────┐
              │   25   60    │
           ╱         │        ╲
  ┌────────┐ ┌──────┐ ┌──────────────┐
  │10 20  │ │40 50 │ │65 70 75 80  │
  └────────┘ └──────┘ └──────────────┘
```

**Case 5: Delete 10 (leaf underflow, merge)**

```
  Remove 10 from [10, 20] → [20]. Has 1 key — underflow!
  
  Borrow from right sibling [40, 50]?
    Right sibling has 2 keys (min) — cannot spare.
  
  Merge [20] with [40, 50] via parent key 25:
    Merged: [20, 25, 40, 50]
    Remove 25 from root → [60]
    
              ┌────┐
              │ 60 │
           ╱        ╲
  ┌──────────────────┐ ┌──────────────┐
  │ 20  25  40  50   │ │65 70 75 80  │
  └──────────────────┘ └──────────────┘
```

### 3.5 B-Tree Deletion — Borrow and Merge Mechanics

**Borrow (Redistribution):**
```
Before Borrow (left child underflow):

        ┌───────┐
        │   50  │
      ╱          ╲
  ┌──────┐    ┌──────────┐
  │ 20   │    │ 60  70   │   ← can spare
  └──────┘    └──────────┘

After Borrow (rotate via parent):

        ┌───────┐
        │   60  │              ← 50 goes up, 60 comes down
      ╱          ╲
  ┌────────┐    ┌──────┐
  │ 20 50  │    │ 70   │
  └────────┘    └──────┘
```

**Merge:**
```
Before Merge (both neighbors at minimum):

        ┌───────┐
        │   50  │
      ╱          ╲
  ┌──────┐    ┌──────┐
  │ 20   │    │ 70   │   ← both at min, cannot borrow
  └──────┘    └──────┘

After Merge (combine with parent key):

  ┌──────────────┐
  │ 20  50  70   │
  └──────────────┘
```

---

## 4. B+Tree

### 4.1 Definition

A **B+Tree** is a variation of the B-Tree where:
- **All keys are stored in the leaves** (internal nodes contain only **routing keys**)
- **Leaf nodes are linked** in sorted order (forming a **sequential linked list**)
- Internal nodes are identical to B-Tree internal nodes (but contain only routing keys — the key values may or may not actually exist in the data)

```
B+Tree of order m = 4:

Internal Nodes (routing only):
           ┌───────────────┐
           │   40    70    │
        ╱         │         ╲
  ┌────────┐ ┌────────┐ ┌────────┐
  │ 20 30  │ │ 50 60  │ │ 80 90  │
  └────────┘ └────────┘ └────────┘
       │          │          │
       ▼          ▼          ▼
  ┌────────┐ ┌────────┐ ┌────────┐
  │10,20,30│→│40,50,60│→│70,80,90│  ← Leaf nodes (all keys)
  └────────┘ └────────┘ └────────┘
       ←─────── sequential access ────→
```

### 4.2 B-Tree vs B+Tree

| Dimension | B-Tree | B+Tree |
|---|---|---|
| **Keys in internal nodes** | Actual data keys | Only routing keys (may not exist in data) |
| **All keys in leaves?** | No | Yes |
| **Leaf linking** | Not linked | Linked (sequential access) |
| **Data pointers** | In every node (internal + leaf) | Only in leaves |
| **Search** | May terminate at internal node | Always reaches leaf |
| **Range queries** | Slow (random access per key) | Fast (sequential scan of leaf chain) |
| **Space utilization** | More pointers in internal nodes | More keys in internal nodes (bushier → shorter) |
| **Order same degree** | Less branching factor | More branching factor (internal nodes only store keys) |
| **Preferred for** | General-purpose indexing | Database indexing, range queries |
| **Insertion/Deletion** | Split/merge at any level | Split/merge at leaf level only |

**Exam Prediction:** A 6-mark comparison of B-Tree vs B+Tree is a very common question.

### 4.3 B+Tree Insertion

**Algorithm:**
1. Search for the leaf where the key should go
2. Insert key into leaf in sorted order
3. If leaf has ≤ m−1 keys, done
4. If leaf overflows (has m keys):
   - **Split leaf** into two: left (ceil(m/2)) and right (remainder)
   - Copy the **first key of the right leaf** up to the parent as routing key
   - Update leaf links
5. If parent overflows, split propagates upward (just like B-Tree)

**Full Trace: B+Tree of Order 4 (m=4)**

⇒ Max keys in leaf = 3, min keys in leaf = ceil(4/2) = 2

Insert: 10, 20, 30, 40, 50, 60, 70

```
Step 1: Insert 10, 20, 30 (leaf has space)

  ┌───────────┐
  │ 10 20 30  │   ← Root (also leaf)
  └───────────┘

Step 2: Insert 40 (leaf full → split)

  Leaf: [10, 20, 30] + 40 → overflows
  Split: left = [10, 20], right = [30, 40]
  Copy first key of right (30) up to new root

            ┌──┐
            │30│
          ╱      ╲
  ┌────────┐    ┌────────┐
  │10 20   │───→│30 40   │
  └────────┘    └────────┘
         ← link →

Step 3: Insert 50

  Search: 50 > 30 → go to right leaf
  Right leaf [30, 40] has space → insert → [30, 40, 50]

            ┌──┐
            │30│
          ╱      ╲
  ┌────────┐    ┌───────────┐
  │10 20   │───→│30 40 50   │
  └────────┘    └───────────┘

Step 4: Insert 60 (right leaf full → split)

  Right leaf: [30, 40, 50] + 60 → overflows
  Split: left = [30, 40], right = [50, 60]
  Copy first key of right (50) up to parent

            ┌──────┐
            │30 50 │
          ╱     │    ╲
  ┌────────┐ ┌──────┐ ┌────────┐
  │10 20   │→│30 40 │→│50 60   │
  └────────┘ └──────┘ └────────┘

Step 5: Insert 70

  Search: 70 > 50 → rightmost leaf
  [50, 60] has space → [50, 60, 70]

            ┌──────┐
            │30 50 │
          ╱     │    ╲
  ┌────────┐ ┌──────┐ ┌───────────┐
  │10 20   │→│30 40 │→│50 60 70  │
  └────────┘ └──────┘ └───────────┘
```

### 4.4 B+Tree Deletion

**Algorithm:**
1. Find and remove the key from the leaf
2. If leaf has ≥ ceil(m/2) keys, done
3. If leaf **underflows**:
   - **Borrow** from sibling (redistribute — move key from sibling via parent)
   - If no sibling can spare → **merge** with sibling
4. When merging leaves, also **remove the routing key** from parent
5. If parent underflows, propagate upward

**Full Trace: B+Tree of Order 4 (m=4)**

Starting tree:
```
            ┌──────┐
            │30 50 │
          ╱     │    ╲
  ┌────────┐ ┌──────┐ ┌───────────┐
  │10 20   │→│30 40 │→│50 60 70  │
  └────────┘ └──────┘ └───────────┘
```

Min leaf keys = ceil(4/2) = 2

**Delete 70:**

```
  Remove 70 from [50, 60, 70] → [50, 60]. Has 2 keys (min = 2). OK.

            ┌──────┐
            │30 50 │
          ╱     │    ╲
  ┌────────┐ ┌──────┐ ┌────────┐
  │10 20   │→│30 40 │→│50 60   │
  └────────┘ └──────┘ └────────┘
```

**Delete 60 (underflow, borrow):**

```
  Remove 60 from [50, 60] → [50]. Has 1 key — underflow!
  
  Borrow from left sibling [30, 40]:
    Left sibling has 2 keys, can spare 1.
    Redistribute: move 40 up to parent, replace parent key 50 with 40.
    
    Left: [30], Right: [40, 50]
    
  But wait, [30] has 1 key — only min is 2!

  Actually for B+Tree borrowing: we shift key from sibling through parent.
  
  Alternative: move the largest key from left sibling to underflow node.
  
  Since left sibling [30, 40] can spare one key (it has 2, min is 2... actually min is 2 so it cannot spare any!).
  Wait — min keys in B+Tree leaf = ceil(m/2) = ceil(4/2) = 2. So [30, 40] has exactly min. Cannot borrow.
  
  Must merge!
  
  Merge [50] with [30, 40] via parent key ... 
  
  Merged leaf: [30, 40, 50] (sorted)
  Remove routing key from parent: [30, 50] → [30]
  
  Root now has [30]. OK (root can have 1 key).
  
            ┌──┐
            │30│
          ╱      ╲
  ┌────────┐    ┌──────────┐
  │10 20   │───→│30 40 50  │
  └────────┘    └──────────┘
```

### 4.5 Use of B+Tree in Indexing

**Why B+Tree is the de facto standard for database indexing:**

1. **Range queries:** The linked leaf chain enables efficient `BETWEEN`, `>`, `<`, `ORDER BY` — just traverse the leaf list
2. **High fanout:** Internal nodes store only routing keys → more keys per node → shorter tree → fewer disk I/Os
3. **Stable search time:** Every search goes to leaf → consistent O(logₘ N) performance
4. **Automatic rebalancing:** Insert/delete operations maintain perfect balance without periodic reorganization
5. **Sequential access:** Leaf chain supports both random and sequential access patterns

```
B+Tree Index in a Database:

Example: Index on Employee.Salary

Table: Employees
┌──────┬─────────┬────────┐
│ EmpID│ Name    │ Salary │
├──────┼─────────┼────────┤
│ 101  │ Alice   │ 50000  │
│ 102  │ Bob     │ 60000  │
│ 103  │ Carol   │ 45000  │
│ 104  │ David   │ 75000  │
│ 105  │ Eve     │ 55000  │
└──────┴─────────┴────────┘

B+Tree Index on Salary:

Internal Nodes (routing):
          ┌─────────────┐
          │   55000     │
        ╱                 ╲
  ┌───────────┐       ┌───────────┐
  │   45000   │       │   60000   │
  └───────────┘       └───────────┘
        │                   │
        ▼                   ▼
Leaves: ┌──────────────────┐    ┌──────────────────┐
        │45000→ptr(Carol)  │───→│55000→ptr(Eve)    │
        │50000→ptr(Alice)  │    │60000→ptr(Bob)    │
        └──────────────────┘    │75000→ptr(David)  │
                                 └──────────────────┘

Query: SELECT * FROM Employees WHERE Salary BETWEEN 50000 AND 60000
  1. Search B+Tree for 50000 → reach left leaf
  2. Scan leaf chain: 50000→Alice, 55000→Eve, 60000→Bob
  3. Return 3 records (no full table scan!)
```

**B-Tree vs B+Tree for Database Indexing:**

| Requirement | B-Tree | B+Tree |
|---|---|---|
| Random access (single key lookup) | ✅ Fast (may stop at internal node) | ✅ Fast (always to leaf) |
| Range scan | ❌ Random I/O per key | ✅ Sequential leaf scan |
| Space for internal nodes | More (keys + data pointers) | Less (only routing keys) |
| Disk I/O per lookup | ~logₘ N | ~logₘ N (same order) |
| Concurrency | Higher complexity | Simpler (only leaves have data) |
| **Winner** | — | **B+Tree** |

**Exam Tip:** The question "Why is B+Tree preferred over B-Tree for database indexing?" is asked for 4-6 marks. Key points: range queries, higher fanout, sequential leaf access.

---

## 5. Trie Tree

### 5.1 Definition

A **Trie** (from "retrieval") is a tree data structure used for storing and searching strings. Each node represents a **single character** (or prefix of a string). All descendants of a node share the same prefix.

```
Trie for words: "cat", "car", "dog", "card"

                  root
               ╱      ╲
              c        d
              │        │
              a        o
            ╱   ╲      │
           t     r     g
                 │
                 d

Insertion order doesn't matter — structure depends on shared prefixes.
```

### 5.2 Properties

- Root represents **empty string**
- Each node stores:
  - An array/hashmap of child pointers (one per possible character)
  - A **flag** indicating whether this node marks the **end of a word**
- Search time: **O(L)** where L = length of the word (independent of number of strings!)
- Space: **O(N × L × alphabet_size)** — can be large

```
Node Structure:

┌──────────────────────────┐
│ children: [26 pointers]  │   ← one per letter (a-z)
│ isEndOfWord: true/false  │
└──────────────────────────┘
```

### 5.3 Trie Insertion

**Algorithm:**
```
Algorithm TrieInsert(root, word):
  current = root
  
  for each character ch in word:
      if current.children[ch] == null:
          current.children[ch] = new TrieNode()
      current = current.children[ch]
  
  current.isEndOfWord = true
```

**Trace: Insert "cat", "car", "dog", "card"**

```
Step 1: Insert "cat"

     root
      │
      c (new)
      │
      a (new)
      │
      t* (new)    ← * marks end of word

Step 2: Insert "car"

     root
      │
      c (exists)
      │
      a (exists)
     ╱   ╲
    t*    r* (new)

Step 3: Insert "dog"

     root
    ╱    ╲
   c      d (new)
   │      │
   a      o (new)
  ╱  ╲    │
 t*   r*  g* (new)

Step 4: Insert "card"

     root
    ╱    ╲
   c      d
   │      │
   a      o
  ╱  ╲    │
 t*   r   g*
       │
       d* (new)
       
  Words: cat, car, card, dog
```

### 5.4 Trie Search

**Algorithm:**
```
Algorithm TrieSearch(root, word):
  current = root
  
  for each character ch in word:
      if current.children[ch] == null:
          return false    // prefix not found
      current = current.children[ch]
  
  return current.isEndOfWord
```

**Trace: Search for "car"**

```
     root
      │
      c → match 'c'
      │
      a → match 'a'
     ╱  ╲
    t    r → match 'r' → end of word → isEndOfWord? → YES → return true
```

**Trace: Search for "can"**

```
     root
      │
      c → match 'c'
      │
      a → match 'a'
     ╱  ╲
    t    r → 'n' not in children → return false
```

**Trace: Search for "ca"**

```
     root
      │
      c → match 'c'
      │
      a → match 'a' → end of input → isEndOfWord? → NO → return false ("ca" is a prefix, not a word)
```

### 5.5 Trie Deletion

**Algorithm:**
```
Algorithm TrieDelete(root, word):
  return DeleteRecursive(root, word, 0)

DeleteRecursive(current, word, depth):
  if depth == word.length:
      if not current.isEndOfWord:
          return false       // word not in trie
      current.isEndOfWord = false
      return current has no children   // can delete this node?
  
  ch = word[depth]
  child = current.children[ch]
  if child == null: return false       // word not in trie
  
  shouldDelete = DeleteRecursive(child, word, depth + 1)
  
  if shouldDelete:
      current.children[ch] = null
      return current has no children AND not isEndOfWord
  
  return false
```

**Trace: Delete "car" from trie containing "cat", "car", "card", "dog"**

```
Step 1: Navigate to end of "car"
    root → c → a → r* (end of word)

Step 2: Unmark isEndOfWord. Now r node:
    r: not end of word, has child 'd' → cannot delete node

Result:
     root
    ╱    ╲
   c      d
   │      │
   a      o
  ╱  ╲    │
 t*   r   g*
       │
       d*

Words remaining: cat, card, dog
("car" is no longer a word, but "card" still exists)
```

### 5.6 B+Tree vs Trie

| Dimension | B+Tree | Trie |
|---|---|---|
| **Data type** | Any comparable key | Strings (characters) |
| **Search time** | O(logₘ N) | O(L) — length of string |
| **Space** | O(N) — compact | O(N × L × Σ) — large |
| **Range queries** | ✅ Excellent (linked leaves) | ❌ Poor |
| **Prefix search** | ❌ Requires separate scan | ✅ Excellent (natural) |
| **Auto-complete** | ❌ Not ideal | ✅ Perfect fit |
| **Dictionary (exact match)** | ✅ Good | ✅ Better (O(L)) |
| **Memory usage** | Low | High (pointer overhead) |
| **Disk I/O optimized** | ✅ Yes | ❌ No (many random accesses) |
| **Used in** | Databases, file systems | Spell-checkers, IP routing, T9, autocomplete |

### 5.7 Compressed Trie (Radix Tree / Patricia Trie)

**Concept:** Merge nodes with a single child into a single node storing the **shared prefix string** to save space.

```
Standard Trie:            Compressed Trie (Radix):
    root                      root
  ╱  │  ╲                  ╱    │     ╲
 p   s   t                "p"  "s"   "t"
 │   │   │                  │    │     │
 r   e   r                "ro" "even" "ree"
 │   │   │                  │    │     │
 o   v     →            ┌──┴──┐ │   ┌──┴──┐
 │   e   e                │    │ │   │    │
 t   n   e             "tein" "n"│ "s"   "e"
     │   │              (prot.) │ (tree) │
    e   s                    "s"  "spass"
                            (seven) 
```

**Advantage:** Fewer nodes, less memory
**Tradeoff:** Complex implementation, node splitting needed during insert

---

## 6. Case Study: Heap as a Priority Queue

### 6.1 Definition

A **Heap** is a complete binary tree that satisfies the **heap property**:
- **Max-Heap:** Every parent node ≥ its children (root = maximum)
- **Min-Heap:** Every parent node ≤ its children (root = minimum)

A **Priority Queue** is an abstract data type where each element has a **priority**, and the element with highest (or lowest) priority is always removed first. A heap provides the most efficient implementation.

```
Max-Heap (visual):        Min-Heap (visual):

        90                       10
      ╱    ╲                   ╱    ╲
     80    70                 20     30
    ╱  ╲  ╱  ╲              ╱  ╲   ╱  ╲
   40 50 60  30             40  50 60  70
```

### 6.2 Array Representation of Heap

A heap is stored as an array using **level-order** indexing (same as complete binary tree):

```
Array indices (1-based):        Array indices (0-based):

        90 (1)                   90 [0]
      ╱      ╲                 ╱      ╲
   80 (2)   70 (3)          80 [1]   70 [2]
   ╱   ╲    ╱   ╲          ╱    ╲    ╱   ╲
40(4) 50(5)60(6)30(7)   40[3] 50[4]60[5]30[6]

Array: [90, 80, 70, 40, 50, 60, 30]   (1-based)

For node at index i:
  Left child: 2i         (or 2i+1 in 0-based)
  Right child: 2i+1      (or 2i+2 in 0-based)
  Parent: floor(i/2)     (or floor((i-1)/2) in 0-based)
```

### 6.3 Heap Operations

#### 6.3.1 Insert (Bubble Up)

**Algorithm:**
```
Algorithm MaxHeapInsert(heap, value):
  heap.append(value)         // add at end
  i = heap.length - 1        // index of new element
  
  while i > 0 and heap[i] > heap[parent(i)]:
      swap heap[i] with heap[parent(i)]
      i = parent(i)
```

**Trace: Insert 85 into max-heap [90, 80, 70, 40, 50, 60, 30]**

```
Initial heap:
        90
      ╱    ╲
     80     70
    ╱  ╲   ╱  ╲
   40 50  60  30

Step 1: Append 85 at end (array: [90, 80, 70, 40, 50, 60, 30, 85])
        90
      ╱    ╲
     80     70
    ╱  ╲   ╱  ╲
   40 50  60  30
  ╱
 85

Step 2: 85 > 40 (parent)? YES → swap
        90
      ╱    ╲
     85     70
    ╱  ╲   ╱  ╲
   40 50  60  30
  ╱
 80

Step 3: 85 > 80 (parent)? YES → swap
        90
      ╱    ╲
     85     70
    ╱  ╲   ╱  ╲
   40 50  60  30
  ╱
 80

Wait — after swap: 85 moves up, 80 moves down:

        90
      ╱    ╲
     85     70
    ╱  ╲   ╱  ╲
   80 50  60  30
  ╱
 40

Step 4: 85 > 90 (parent)? NO → stop

Final heap:
        90
      ╱    ╲
     85     70
    ╱  ╲   ╱  ╲
   80 50  60  30
  ╱
 40

Array: [90, 85, 70, 80, 50, 60, 30, 40]
```

**Time complexity:** O(log N) — height of heap

#### 6.3.2 Delete / Extract Max (Trickle Down)

**Algorithm:**
```
Algorithm MaxHeapExtractMax(heap):
  if heap is empty: return error
  max = heap[0]                    // root is max
  heap[0] = heap[last]            // replace root with last element
  heap.removeLast()
  MaxHeapify(heap, 0)             // restore heap property
  return max

Algorithm MaxHeapify(heap, i):
  // Also called "trickle down" or "sift down"
  largest = i
  left = 2i + 1
  right = 2i + 2
  
  if left < heap.size and heap[left] > heap[largest]:
      largest = left
  if right < heap.size and heap[right] > heap[largest]:
      largest = right
  if largest ≠ i:
      swap heap[i] with heap[largest]
      MaxHeapify(heap, largest)
```

**Trace: Extract max from [90, 85, 70, 80, 50, 60, 30, 40]**

```
Initial:
        90
      ╱    ╲
     85     70
    ╱  ╲   ╱  ╲
   80 50  60  30
  ╱
 40

Step 1: max = 90. Replace root with last element (40).
        40
      ╱    ╲
     85     70
    ╱  ╲   ╱  ╲
   80 50  60  30

Step 2: MaxHeapify at root (index 0):
  Compare 40 with children 85, 70. 85 is largest.
  Swap 40 and 85.
  
        85
      ╱    ╲
     40     70
    ╱  ╲   ╱  ╲
   80 50  60  30

Step 3: MaxHeapify at index 1 (where 40 landed):
  Compare 40 with children 80, 50. 80 is largest.
  Swap 40 and 80.
  
        85
      ╱    ╲
     80     70
    ╱  ╲   ╱  ╲
   40 50  60  30

Step 4: MaxHeapify at index 3 (where 40 landed):
  40 has children? Left = 7 (40×2+1), right = 8. heap size = 7. No children. Stop.

Final heap:
        85
      ╱    ╲
     80     70
    ╱  ╲   ╱  ╲
   40 50  60  30

Array: [85, 80, 70, 40, 50, 60, 30]
```

**Time complexity:** O(log N)

#### 6.3.3 Heapify (Building a Heap from Array)

**Algorithm:** Build a heap from an unsorted array in **O(N)** time by applying MaxHeapify on all non-leaf nodes from bottom to top.

```
Algorithm BuildMaxHeap(arr):
  n = arr.length
  for i = floor(n/2) - 1 down to 0:   // last non-leaf node
      MaxHeapify(arr, i, n)
```

**Trace: Build max-heap from [10, 20, 30, 40, 50, 60, 70]**

```
Initial array (random order):
        10
      ╱    ╲
     20     30
    ╱  ╲   ╱  ╲
   40 50  60  70

n = 7, last non-leaf index = floor(7/2)-1 = 2

Step 1: MaxHeapify at index 2 (value 30):
  Children: 60 (index 5), 70 (index 6). 70 is largest.
  Swap 30 and 70.
  
        10
      ╱    ╲
     20     70
    ╱  ╲   ╱  ╲
   40 50  60  30

Step 2: MaxHeapify at index 1 (value 20):
  Children: 40 (index 3), 50 (index 4). 50 is largest.
  Swap 20 and 50.
  
        10
      ╱    ╲
     50     70
    ╱  ╲   ╱  ╲
   40 20  60  30

Step 3: MaxHeapify at index 0 (value 10):
  Children: 50 (index 1), 70 (index 2). 70 is largest.
  Swap 10 and 70.
  
        70
      ╱    ╲
     50     10
    ╱  ╲   ╱  ╲
   40 20  60  30

Step 4: MaxHeapify at index 2 (where 10 landed):
  Children: 60 (index 5), 30 (index 6). 60 is largest.
  Swap 10 and 60.
  
        70
      ╱    ╲
     50     60
    ╱  ╲   ╱  ╲
   40 20  10  30

Final max-heap: [70, 50, 60, 40, 20, 10, 30]
```

**Why O(N) and not O(N log N)?**
Each node at height `h` requires at most `h` swaps. Sum over all nodes: `Σ (n/2^(h+1)) × h = O(N)`.

#### 6.3.4 Heap Sort

**Algorithm:**
```
Algorithm HeapSort(arr):
  BuildMaxHeap(arr)               // O(N)
  n = arr.length
  
  for i = n-1 down to 1:          // O(N log N)
      swap arr[0] with arr[i]     // move max to end
      MaxHeapify(arr, 0, i)       // restore heap on reduced array
```

**Trace: HeapSort on [10, 20, 30, 40, 50, 60, 70]**

```
Step 1: BuildMaxHeap → [70, 50, 60, 40, 20, 10, 30]

Step 2: i=6: Swap 70,30 → [30, 50, 60, 40, 20, 10, 70] → MaxHeapify(0,6)
  [60, 50, 30, 40, 20, 10, 70]

Step 3: i=5: Swap 60,10 → [10, 50, 30, 40, 20, 60, 70] → MaxHeapify(0,5)
  [50, 40, 30, 10, 20, 60, 70]

Step 4: i=4: Swap 50,20 → [20, 40, 30, 10, 50, 60, 70] → MaxHeapify(0,4)
  [40, 20, 30, 10, 50, 60, 70]

Step 5: i=3: Swap 40,10 → [10, 20, 30, 40, 50, 60, 70] → MaxHeapify(0,3)
  [30, 20, 10, 40, 50, 60, 70]

Step 6: i=2: Swap 30,10 → [10, 20, 30, 40, 50, 60, 70] → MaxHeapify(0,2)
  [20, 10, 30, 40, 50, 60, 70]

Step 7: i=1: Swap 20,10 → [10, 20, 30, 40, 50, 60, 70] → sorted!

Result: [10, 20, 30, 40, 50, 60, 70]
```

**Time: O(N log N)** | **Space: O(1)** (in-place) | **Not stable**

### 6.4 Heap as Priority Queue — Summary

| Operation | Unsorted Array | Sorted Array | Binary Heap |
|---|---|---|---|
| Insert | O(1) | O(N) | O(log N) |
| Extract Max/Min | O(N) | O(1) | O(log N) |
| Peek (get max/min) | O(N) | O(1) | O(1) |
| Build | O(N) | O(N log N) | O(N) |
| Heap Sort | — | — | O(N log N) |

**Applications:**
- **Priority Scheduling** (OS task scheduling)
- **Dijkstra's Algorithm** (min-heap for shortest path)
- **Prim's Algorithm** (min-heap for MST)
- **Huffman Coding** (min-heap for frequency tree)
- **Median finding** (two heaps — max-heap + min-heap)
- **K largest/smallest elements** in a stream

**Exam Tip:** The 4-mark case study question on "Heap as Priority Queue" typically asks you to:
- Define heap and priority queue
- Show array representation
- Explain insert and delete with traces
- State time complexities

---

## 7. Comparison Tables

### 7.1 Index Type Comparison

| Dimension | Primary Index | Secondary Index | Clustering Index |
|---|---|---|---|
| **Key field** | Ordering key | Non-ordering key | Ordering non-key |
| **Density** | Sparse (per block) | Dense (per record) | Sparse (per distinct value) |
| **Data order** | Ordered | Unordered | Ordered |
| **Uniqueness** | Unique | Can be non-unique | Non-unique |
| **Number of index entries** | #blocks | #records | #distinct key values |
| **Search speed** | Fast + block scan | Fast (direct to record) | Fast + group scan |
| **Update cost** | Low | High | Medium |
| **Example** | Index on RollNo (sorted) | Index on Name (unsorted) | Index on Dept (sorted, duplicates) |

### 7.2 B-Tree vs B+Tree

| Dimension | B-Tree | B+Tree |
|---|---|---|
| **Data pointers** | In all nodes (internal + leaf) | Only in leaf nodes |
| **Internal nodes store** | Keys + data pointers | Only routing keys (no data pointers) |
| **Leaf linking** | Not linked | Linked (sequential access) |
| **Range queries** | Inefficient (traverse up/down) | Efficient (scan leaf chain) |
| **Search termination** | May stop at internal node | Always reaches leaf |
| **Space utilization** | Fewer keys per internal node | More keys per internal node (bushier) |
| **Height** | Slightly taller | Shorter (higher fanout) |
| **Insertion** | Split may occur at any level | Split always at leaf |
| **Deletion** | Borrow/merge at any level | Borrow/merge at leaf level |
| **DB indexing use** | Less common | Industry standard (MySQL, Oracle, PostgreSQL) |
| **File system use** | Less common | NTFS, HFS+, some Linux FS |

### 7.3 B+Tree vs Trie

| Dimension | B+Tree | Trie |
|---|---|---|
| **Key type** | Any comparable type | Strings |
| **Search complexity** | O(logₘ N) | O(L) |
| **Space** | O(N) — compact | O(N×L×Σ) — can be large |
| **Range queries** | ✅ Excellent | ❌ Poor |
| **Prefix search** | ❌ Requires full scan | ✅ O(L) — natural |
| **Auto-complete** | ❌ Not suitable | ✅ Excellent |
| **Exact match** | ✅ Good | ✅ Better |
| **Insert/Delete** | O(logₘ N) with rebalancing | O(L) |
| **Disk optimized** | ✅ Yes | ❌ No |
| **Memory optimized** | ✅ Yes | ❌ No |
| **Database indexing** | ✅ Standard choice | ❌ Rare |
| **Dictionary / spell-check** | ❌ Uncommon | ✅ Standard choice |

---

## 8. Complexity Reference Sheet

| Data Structure | Search | Insert | Delete | Space |
|---|---|---|---|---|
| **Primary Index** (sparse) | O(log B) + block scan | O(log B) | O(log B) | O(B) |
| **Secondary Index** (dense) | O(log N) | O(log N) | O(log N) | O(N) |
| **m-way Search Tree** (unbalanced) | O(m × logₘ N) | O(m × logₘ N) | O(m × logₘ N) | O(N) |
| **B-Tree** (order m) | O(logₘ N) | O(logₘ N) | O(logₘ N) | O(N) |
| **B+Tree** (order m) | O(logₘ N) | O(logₘ N) | O(logₘ N) | O(N) |
| **Trie** (alphabet Σ) | O(L) | O(L) | O(L) | O(N×L×Σ) |
| **Compressed Trie** | O(L) | O(L) | O(L) | O(N×L) — smaller |
| **Heap** (as Priority Queue) | O(1) peek | O(log N) | O(log N) | O(N) |
| **Heap Sort** | — | O(N log N) | O(N log N) | O(1) in-place |
| **Heapify** | — | O(N) | — | O(1) |

Where: N = number of records, B = number of blocks, L = string length, Σ = alphabet size, m = order of tree.

---

## 9. Expected Exam Questions (Pattern Analysis)

| Question Type | Marks | Frequency |
|---|---|---|
| Explain B-Tree insertion with example (trace step-by-step) | 8 | Very High |
| Explain B+Tree with diagram and use in indexing | 6-8 | Very High |
| Compare B-Tree and B+Tree | 4-6 | Very High |
| Explain primary, secondary, dense, sparse indexing | 6 | High |
| Trie insertion and search trace with example words | 6 | High |
| Heap as Priority Queue — insert/extract with traces | 6 | Medium |
| Explain multiway search tree with properties | 4 | Medium |
| Compare dense vs sparse indexing | 4 | High |
| B-Tree deletion with borrow/merge trace | 8 | Medium |
| Explain Compressed Trie / Radix Tree concept | 4 | Low |
| Heap sort on given array (trace) | 6 | Medium |
| Difference between B+Tree and Trie | 4 | Medium |
| Build heap from array (heapify trace) | 6 | Medium |

**Command Words Used:**
- **Define / State** (L1) — 2 marks — indexing, B-Tree, B+Tree, Trie
- **Explain / Describe** (L2) — 4-6 marks — indexing techniques, multiway trees, heap operations
- **Apply / Trace** (L3) — 6-8 marks — B-Tree/B+Tree insertion/deletion, heap operations, heap sort
- **Compare / Differentiate** (L4) — 4-6 marks — B-Tree vs B+Tree, dense vs sparse indexing, B+Tree vs Trie
- **Analyze** (L4-L5) — 6 marks — why B+Tree for DB indexing, heapify complexity

**Exam Prediction:**
- Most likely 8-mark question: **"Trace B-Tree insertion for given sequence (order 5)."**
- Most likely 6-mark question: **"Explain B+Tree structure. Why is it preferred for database indexing?"**
- Most likely 4-mark question: **"Compare dense and sparse indexing."**

---

## 10. Rapid Revision — One Page Summary

### TOP 5 DEFINITIONS

1. **Indexing:** Data structure technique to locate records quickly without scanning entire file
2. **B-Tree:** Balanced m-way search tree where all leaves at same depth; order m defines max children
3. **B+Tree:** All keys in leaves, internal nodes only route, leaves linked for sequential access
4. **Trie:** Character-based tree for prefix matching and string search
5. **Heap:** Complete binary tree with heap property (parent ≥ or ≤ children); implemented as priority queue

### TOP 5 FORMULAS / KEY POINTS

1. **B-Tree order m:** max keys/node = m−1, min keys (non-root) = ceil(m/2)−1
2. **Heap array indexing (0-based):** parent = (i−1)/2, left = 2i+1, right = 2i+2
3. **Heapify:** O(N) — not O(N log N) — apply MaxHeapify on non-leaf nodes from bottom
4. **Trie search:** O(L) where L is string length, independent of number of strings
5. **B+Tree range query:** Find start key in leaf, then traverse linked leaf list

### QUICK COMPARISONS

| A | B | Key Difference |
|---|---|---|
| Primary Index | Secondary Index | Sparse (per block) vs Dense (per record) |
| Dense Index | Sparse Index | Every record vs every block; more space vs faster search |
| B-Tree | B+Tree | Data pointers in all nodes vs only leaves; B+Tree has linked leaves |
| B+Tree | Trie | Disk-optimized for any keys vs memory-optimized for strings |
| Heap | BST | Complete tree (array) vs arbitrary shape; heap property vs BST property |
| Insert (Heap) | Delete (Heap) | Bubble Up vs Trickle Down |
| Heapify (O(N)) | Heap Sort (O(N log N)) | Build O(N) + N extractions × O(log N) |

### EXAM PREDICTION

Most likely 8-mark question: **"Trace B-Tree insertion and deletion for given keys (order 5)."**  
Most likely 6-mark question: **"Explain B+Tree with diagram. How is it used in database indexing?"**  
Most likely 4-mark question: **"Compare primary, secondary, and clustering indexing."**

### MUST-KNOW

B-Tree insertion/deletion traces (order 5), B+Tree structure and leaf linking, Dense vs Sparse index table, Heap as priority queue (insert + delete trace), Trie insertion/search trace, Complexity of all operations

### MNEMONICS

**B-Tree split rule:** "Node is full? Find median, send it up, split the rest"  
**B+Tree leaf rule:** "All keys below, leaf links in a row"  
**Heap insert:** "Add at end, bubble up"  
**Heap delete:** "Replace root, trickle down"  
**Heapify:** "Bottom-up, start from last non-leaf"  
**Trie search:** "Follow characters, check end flag"

---

## 11. Learning Acceleration Footer

| Item | Details |
|---|---|
| **Spaced Repetition Schedule** | D1 | D2 | D4 | D8 | D16 |
| **Top 3 Mnemonics** | "B-Tree splits median up"; "Heap: insert bubble-up, delete trickle-down"; "Trie: chars = path, flag = word end" |
| **Self-Test Questions** | See Section 12 below |
| **Feynman Challenge** | "Explain in one sentence: Why does B+Tree have linked leaves while B-Tree does not?" |
| **Cross-Link** | Unit III (Binary Search Tree) ↔ B-Tree (m-way generalization); Unit II (Priority Queue) ↔ Heap; Unit IV (Sorting) ↔ Heap Sort |
| **Order of m for B-Tree** | For database use, typical order m = 100-200 (high fanout → 3-4 levels for millions of records) |
| **Bloom Level Reached** | L4 (Analyze) — Push to L5 by evaluating which indexing strategy is best for a given workload (heavy writes vs heavy reads vs range queries) |

---

## 12. Self-Test Questions

**Q1:** What is the minimum number of keys in a non-root node of a B-Tree of order 7?  
*Answer: ceil(7/2) − 1 = 3 − 1 = 2 keys*

**Q2:** A B+Tree of order 5 has how many pointers in each internal node?  
*Answer: Maximum 5, minimum ceil(5/2) = 3*

**Q3:** Trace B-Tree insertion of keys 10, 20, 30, 40, 50, 25 into an initially empty tree of order 5.  
*Hint: Split when 50 is inserted, median 30 moves up.*

**Q4:** Why is B+Tree preferred over B-Tree for database range queries like `WHERE salary BETWEEN 50000 AND 70000`?  
*Answer: B+Tree leaf nodes are linked; once the start key is found, the remaining keys are retrieved by sequentially traversing the leaf chain. B-Tree requires separate traversal for each key.*

**Q5:** In a trie storing English words (a-z), what is the worst-case space per node?  
*Answer: 26 child pointers per node (if array-based). Can be reduced with hashmap or linked list.*

**Q6:** Given array [12, 11, 13, 5, 6, 7], trace heapify to build a max-heap.  
*Hint: Start from index floor(6/2)−1 = 2 (value 13).*

**Q7:** What is the time complexity to build a heap from an unsorted array? How does it differ from inserting N elements one by one?  
*Answer: Build = O(N) (heapify all non-leaves once). N insertions = O(N log N).*

**Q8:** In a B-Tree of order 5, you delete a key and a leaf underflows. The left sibling has 3 keys and the right sibling has 4 keys. What happens?  
*Answer: Borrow from right sibling (has more keys). Redistribute via parent: move parent key down, move first key of right sibling up.*

**Q9:** What is the space complexity of a standard trie with N words each of average length L over an alphabet of size 26?  
*Answer: O(N × L × 26) in the worst case if using array-based child pointers.*

**Q10:** Can a secondary index be sparse?  
*Answer: No — secondary index is always dense because the data file is not ordered on the indexing field; you need a pointer to every record.*

**Q11:** Is heap sort stable?  
*Answer: No — long-range swaps can change relative order of equal elements.*

**Q12:** What happens if you insert a key into a B+Tree that already exists?  
*Answer: Depends on implementation — typically duplicates are allowed (appended to leaf) or rejected. For databases, the index may handle them via overflow or separate chain.*

---

*End of Unit V — Indexing and Multiway Trees Notes*
