# 210252: Data Structures and Algorithms — Unit VI: File Organization

**University:** Savitribai Phule Pune University (SPPU)  
**Program:** S.E. Computer Engineering (2019 Pattern)  
**Semester:** IV  
**Duration:** 07 Hours  
**CO Mapping:** CO4, CO6  
**Exam Weightage:** ~10–14 marks (End Sem) + ~4–6 marks (Mid Sem)

---

## Syllabus (Verbatim)

> Files: concept, need, primitive operations. Sequential file organization — concept and primitive operations. Direct Access File — Concepts and Primitive operations. Indexed sequential file organization — concept, types of indices, structure of index sequential file. Linked Organization — multi list files, coral rings, inverted files and cellular partitions.
> Case Study: External Sort — Consequential processing and merging two lists, multiway merging — a k-way merge algorithm

---

## CO—Bloom Mapping for Unit VI

| Topic | CO | Bloom Level |
|---|---|---|
| File Concepts & Primitive Operations | CO4 | L1 — Remember |
| Sequential File Organization | CO4 | L2 — Understand |
| Direct Access File Organization | CO4 | L3 — Apply |
| Indexed Sequential File Organization | CO4 | L3 — Apply |
| Linked Organization (Multi-list, Coral Rings) | CO4 | L2 — Understand |
| Inverted Files & Cellular Partitions | CO4 | L4 — Analyze |
| External Sort — Consequential Processing | CO6 | L3 — Apply |
| External Sort — Multiway Merging / k-way Merge | CO6 | L4 — Analyze |

---

## 1. File Concepts

### 1.1 Data vs Information vs File

| Term | Definition | Example |
|---|---|---|
| **Data** | Raw, unprocessed facts — no meaning in isolation | `101`, `'A'`, `35.6` |
| **Information** | Processed, organized data with context and meaning | `"Student age = 20"` |
| **File** | A named collection of related records stored on secondary storage | `student.dat` |

### 1.2 Definition of a File

A **File** is a logical collection of related records stored permanently on secondary storage (disk, SSD). It is the fundamental unit of data storage in operating systems.

```
Structured view of a file:

  FILE: employee.dat
  ┌──────────────────────────────────────────────────────┐
  │  RECORD 1: {101, "Alice", "Engineer", 75000}         │
  │  RECORD 2: {102, "Bob",   "Manager",  90000}         │
  │  RECORD 3: {103, "Carol", "Analyst",  65000}         │
  │  ...                                                  │
  └──────────────────────────────────────────────────────┘

  File = Collection of Records
  Record = Collection of Fields
  Field = Smallest logical unit of data
```

### 1.3 Key Terminology

| Term | Definition |
|---|---|
| **Field** | The smallest logical data item in a file (e.g., name, age, salary) |
| **Record** | A collection of related fields treated as a unit (e.g., one employee) |
| **Key** | A field (or combination of fields) that uniquely identifies a record |
| **Primary Key** | Unique identifier for each record (e.g., Employee ID) |
| **Secondary Key** | Non-unique field used for searching (e.g., Department) |
| **File** | Collection of related records |
| **Database** | Collection of related, integrated files |

### 1.4 Need for File Organization

| Need | Explanation |
|---|---|
| **Persistence** | Data survives beyond program execution (disk vs RAM) |
| **Large Data Capacity** | Secondary storage holds data that does not fit in RAM |
| **Data Sharing** | Multiple programs/users access the same data concurrently |
| **Reusability** | Data written once, read many times by different processes |
| **Efficient Access** | Proper organization enables fast search, retrieval, update |
| **Backup & Recovery** | File data can be backed up; RAM data is volatile |

### 1.5 Primitive File Operations

| Operation | Description | Pseudocode |
|---|---|---|
| **OPEN** | Prepare file for reading/writing; locate file on disk | `OPEN(filename, mode)` |
| **READ** | Read next record (sequential) or record at position (direct) | `READ(file, buffer, size)` |
| **WRITE** | Append a new record or overwrite existing | `WRITE(file, buffer, size)` |
| **SEEK** | Move file pointer to a specific position | `SEEK(file, offset, whence)` |
| **CLOSE** | Release file resources; flush buffers to disk | `CLOSE(file)` |

```
File Pointer Movement:
┌────────────────────────────────────────────────────┐
│  File on Disk                                       │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┐       │
│  │ R1   │ R2   │ R3   │ R4   │ R5   │ R6   │       │
│  └──▲───┴──────┴──────┴──────┴──────┴──────┘       │
│     │                                                │
│  File Pointer (current position)                     │
│                                                      │
│  OPEN → pointer at start (position 0)                │
│  READ → read current, pointer advances               │
│  SEEK → move pointer to arbitrary position           │
│  WRITE → write at pointer position, pointer advances  │
│  CLOSE → flush and release                           │
└────────────────────────────────────────────────────┘
```

---

## 2. Sequential File Organization

### 2.1 Concept

**Definition:** Records are stored one after another in a sequential order, typically sorted by a **key field**. Access is possible only in the order records appear — to read record N, all preceding N−1 records must be read first.

```
Logical View of Sequential File (sorted by EmpID):

┌────────┬────────┬────────┬────────┬────────┬────────┐
│ EmpID: │ EmpID: │ EmpID: │ EmpID: │ EmpID: │ EmpID: │
│  101   │  102   │  103   │  104   │  105   │  106   │
│ Alice  │  Bob   │ Carol  │ David  │  Eve   │ Frank  │
│  75K   │  90K   │  65K   │  80K   │  70K   │  95K   │
└────────┴────────┴────────┴────────┴────────┴────────┘
   ↑                                       ↑
  START                                   END
```

**Key Properties:**
- Records stored in ascending/descending order of key
- Physical order matches logical order
- **Best for:** Batch processing, sequential access (reports, tape storage)
- **Worst for:** Random access, frequent insertions/deletions

### 2.2 Master File and Transaction File

In batch processing systems, two files are used together:

| File | Description |
|---|---|
| **Master File** | The main, permanent file containing current data (e.g., all employee records) |
| **Transaction File** | A temporary file containing pending changes (inserts, updates, deletes) to be applied to the master |

```
Batch Update Process:

  Master File (old) ──────┐
                           ├──→ UPDATE PROGRAM ──→ Master File (new)
  Transaction File ────────┘
```

### 2.3 Primitive Operations on Sequential Files

#### 2.3.1 Sequential Read (Search by Key)

```
Algorithm Sequential_Search(file, targetKey):
  OPEN file
  position = 0

  while not EOF(file):
      record = READ(file)
      if record.key == targetKey:
          CLOSE(file)
          return record, position
      position = position + 1

  CLOSE(file)
  return NOT_FOUND
```

**Trace:**

```
File: employee.dat (sorted by EmpID)
Target: EmpID = 105

Step | Position | Record Read | Key Matched? | Action
─────┼──────────┼─────────────┼──────────────┼─────────────
1    | 0        | (101, Alice)| 101≠105      | Continue
2    | 1        | (102, Bob)  | 102≠105      | Continue
3    | 2        | (103, Carol)| 103≠105      | Continue
4    | 3        | (104, David)| 104≠105      | Continue
5    | 4        | (105, Eve)  | 105=105 ✓    | Return record

Comparisons: 5
```

**Time complexity:** O(N) — worst case, must scan entire file.

#### 2.3.2 Insert

```
Algorithm Sequential_Insert(file, newRecord):
  // Strategy: Rewrite entire file with new record inserted in sorted order
  OPEN file in READ mode
  OPEN tempFile in WRITE mode
  inserted = false

  while not EOF(file):
      record = READ(file)
      if not inserted AND newRecord.key < record.key:
          WRITE(tempFile, newRecord)
          inserted = true
      WRITE(tempFile, record)

  if not inserted:          // new record goes at end
      WRITE(tempFile, newRecord)

  CLOSE(file)
  CLOSE(tempFile)
  DELETE(file)
  RENAME(tempFile → file)
```

**Example:**

```
Before Insert: [101, 103, 105, 107]
Insert key 104:
Step 1: Read 101 → write 101 (104 > 101)
Step 2: Read 103 → write 103 (104 > 103)
Step 3: Read 105 → write 104 (104 < 105, insert here)
Step 4: Write 105
Step 5: Read 107 → write 107

After Insert: [101, 103, 104, 105, 107]
```

#### 2.3.3 Delete

```
Algorithm Sequential_Delete(file, targetKey):
  OPEN file in READ mode
  OPEN tempFile in WRITE mode

  while not EOF(file):
      record = READ(file)
      if record.key ≠ targetKey:
          WRITE(tempFile, record)
      // else: skip (delete)

  CLOSE(file)
  CLOSE(tempFile)
  DELETE(file)
  RENAME(tempFile → file)
```

**Example:**

```
Before Delete: [101, 102, 103, 104, 105]
Delete key 103:
Step 1: Read 101 → write 101
Step 2: Read 102 → write 102
Step 3: Read 103 → skip (delete)
Step 4: Read 104 → write 104
Step 5: Read 105 → write 105

After Delete: [101, 102, 104, 105]
```

#### 2.3.4 Update

```
Algorithm Sequential_Update(file, targetKey, newData):
  OPEN file in READ mode
  OPEN tempFile in WRITE mode

  while not EOF(file):
      record = READ(file)
      if record.key == targetKey:
          record.data = newData    // modify
      WRITE(tempFile, record)

  CLOSE(file)
  CLOSE(tempFile)
  DELETE(file)
  RENAME(tempFile → file)
```

### 2.4 Advantages and Disadvantages

| Advantage | Disadvantage |
|---|---|
| Simple to implement | Slow random access (O(N)) |
| Efficient for batch processing | Insert/delete requires rewriting entire file |
| Good for sequential reports | Wastage if records have variable length |
| Works well on tape storage | Poor for interactive/online systems |
| Minimal storage overhead | All operations are O(N) |

---

## 3. Direct Access File Organization (Random File)

### 3.1 Concept

**Definition:** Records are stored and retrieved directly by their **key** using a **hash function** or computed address. The physical location on disk is computed from the key — no sequential scan needed.

```
Direct File — Address computed via hash function h(key):

              Key: 101 ──────┐
                              │ h(101) = 4
                              ▼
┌────┬────┬────┬────┬────┬────┬────┬────┐
│    │    │    │    │ R1 │    │    │    │
│    │    │    │    │101 │    │    │    │
│    │    │    │    │Alice│    │    │    │
└────┴────┴────┴────┴────┴────┴────┴────┘
  0    1    2    3    4    5    6    7

Key 101 maps directly to address 4 — O(1) access!
```

**Key Properties:**
- Access time = O(1) average (best case)
- Uses hashing to compute record address from key
- Records need not be in sorted order
- Requires collision resolution mechanism
- **Best for:** Random access, online transaction processing
- **Worst for:** Sequential scan of entire file

### 3.2 Hashing Techniques for Direct Files

#### 3.2.1 Division Method

```
h(key) = key MOD fileSize
```

**Example:** File size = 100, Keys = {101, 205, 338, 440}

```
h(101) = 101 MOD 100 = 1
h(205) = 205 MOD 100 = 5
h(338) = 338 MOD 100 = 38
h(440) = 440 MOD 100 = 40
```

#### 3.2.2 Mid-Square Method

```
Step 1: Square the key
Step 2: Extract middle digits
```

**Example:** key = 1234, file size = 1000

```
1234² = 1522756
Middle 3 digits = 227
Address = 227
```

#### 3.2.3 Folding Method

```
Split key into parts and add them.
```

**Example:** key = 123456789, file size = 1000

```
Part 1: 123
Part 2: 456
Part 3: 789
Sum = 123 + 456 + 789 = 1368
Address = 1368 MOD 1000 = 368
```

#### 3.2.4 Digit Analysis Method

Analyze the digit distribution of keys and select positions with most uniform distribution.

```
Keys:  12345, 12367, 12489, 12501
Digits: 1-2-3-4-5, 1-2-3-6-7, 1-2-4-8-9, 1-2-5-0-1

Digit frequency:
Pos 1: 1→4 (skewed — all same)  →  Discard
Pos 2: 2→4 (skewed)             →  Discard
Pos 3: 3→2, 4→1, 5→1           →  Good distribution
Pos 4: 4→2, 6→1, 8→1, 0→1     →  Good distribution
Pos 5: 5→1, 7→1, 9→1, 1→1     →  Good distribution

Use positions 3, 4, 5 as address.
```

### 3.3 Collision Handling

**Collision:** Two different keys map to the same address.

```
Example: File size = 10
h(25) = 25 MOD 10 = 5
h(35) = 35 MOD 10 = 5  ← COLLISION!
h(45) = 45 MOD 10 = 5  ← COLLISION!
```

#### 3.3.1 Open Addressing (Linear Probing)

```
If h(k) is occupied, try h(k)+1, h(k)+2, ... until empty slot found.
```

```
h(25) = 5  →  position 5: free   →  place at 5
h(35) = 5  →  position 5: busy   →  try 6: free → place at 6
h(45) = 5  →  position 5: busy   →  try 6: busy → try 7: free → place at 7
```

#### 3.3.2 Chaining (Overflow Area)

```
Each home address has a linked list (chain) of records
that hash to that address. Overflow records stored in
a separate overflow area.
```

```
Primary Area:          Overflow Area:
┌─────┐               ┌─────┐
│  0  │               │     │
├─────┤               ├─────┤
│  1  │               │     │
├─────┤               ├─────┤
│  2  │               │ 35  │──→│ 45  │──→│ 55  │
├─────┤               └─────┘   └─────┘   └─────┘
│  3  │
├─────┤
│  4  │
├─────┤
│ 25* │──→ records at address 5 overflow to chain
└─────┘
```

### 3.4 Primitive Operations on Direct Files

#### 3.4.1 Read (Direct Access)

```
Algorithm Direct_Read(file, key):
  address = h(key)              // compute hash
  record = READ_AT(file, address)

  if record.key == key:
      return record              // exact match at home address

  // Collision: follow overflow chain or probe
  while record ≠ EMPTY and record.key ≠ key:
      record = NEXT_IN_CHAIN(record)

  if record.key == key:
      return record
  else:
      return NOT_FOUND
```

**Trace:**

```
File (size = 10), h(k) = k MOD 10
Keys stored: 25@5, 35@6, 45@7  (linear probing)

Search for key = 45:
Step 1: h(45) = 5  →  record at addr 5 is 25 (≠ 45)
Step 2: Probe addr 6 → record is 35 (≠ 45)
Step 3: Probe addr 7 → record is 45 ✓  (found)

Comparisons: 3 (worst case could be many)
```

#### 3.4.2 Write (Direct Insert)

```
Algorithm Direct_Write(file, newRecord):
  address = h(newRecord.key)

  if file[address] is EMPTY:
      WRITE_AT(file, address, newRecord)
  else:
      // Collision — find next free slot (linear probing)
      while file[address] is not EMPTY:
          address = (address + 1) MOD fileSize
      WRITE_AT(file, address, newRecord)
```

#### 3.4.3 Delete

```
Algorithm Direct_Delete(file, key):
  address = h(key)
  record = READ_AT(file, address)

  // Traverse to find it (handling collisions)
  while record ≠ EMPTY and record.key ≠ key:
      address = NEXT_PROBE(address)
      record = READ_AT(file, address)

  if record.key == key:
      MARK_DELETED(file, address)    // mark, don't physically remove
      return SUCCESS
  else:
      return NOT_FOUND
```

**Exam Tip:** In deletion, use a **deleted marker** (tombstone) rather than clearing the slot. Otherwise, probe sequences for subsequent keys break.

---

## 4. Indexed Sequential File Organization (ISAM)

### 4.1 Concept

**Definition:** Combines the benefits of sequential and direct access. A file is stored in sorted order (like sequential), but an **index** is maintained to allow faster-than-linear access. The index is searched first (binary search possible), then a small sequential scan within a block.

```
ISAM Structure:

       INDEX (sparse)                    DATA (sequential)
   ┌──────────────┐                 ┌─────────────────────┐
   │ Key  │ Block│                 │ Block 0             │
   ├──────┼──────┤                 │ ┌───┬───┬───┬───┐   │
   │ 101  │  0   │────────────────→│ │101│102│103│104│   │
   │ 105  │  1   │────────────────→│ └───┴───┴───┴───┘   │
   │ 109  │  2   │────────────────→│ Block 1             │
   │ 113  │  3   │                 │ ┌───┬───┬───┬───┐   │
   └──────┴──────┘                 │ │105│106│107│108│   │
                                   │ └───┴───┴───┴───┘   │
                                   │ Block 2             │
                                   │ ┌───┬───┬───┬───┐   │
                                   │ │109│110│111│112│   │
                                   │ └───┴───┴───┴───┘   │
                                   └─────────────────────┘
```

### 4.2 Types of Indices

| Index Type | Level | Description |
|---|---|---|
| **Primary Index** | Top-level | One entry per data block — key holds the smallest key in that block |
| **Cylinder Index** | Middle-level (disk) | Maps key ranges to cylinder numbers (disk geometry) |
| **Track Index** | Low-level (disk) | Maps key ranges to track numbers within a cylinder |

```
Multi-Level Index (Disk-Aware):

  ┌─────────────────┐
  │  PRIMARY INDEX   │   (in memory / fast storage)
  │  101 → Cyl 0    │
  │  201 → Cyl 1    │
  │  301 → Cyl 2    │
  └────────┬────────┘
           │
  ┌────────▼────────┐
  │  CYLINDER INDEX  │   (one per cylinder)
  │  Cyl 0:          │
  │  101 → Track 0   │
  │  125 → Track 1   │
  │  150 → Track 2   │
  │  175 → Track 3   │
  └────────┬────────┘
           │
  ┌────────▼────────┐
  │   TRACK INDEX    │   (one per track)
  │  Track 0:        │
  │  101 → Block 0   │
  │  106 → Block 1   │
  │  111 → Block 2   │
  └─────────────────┘
```

### 4.3 Structure of Index Sequential File

```
┌──────────────────────────────────────────────────────┐
│               INDEXED SEQUENTIAL FILE                 │
├──────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────┐  │
│  │            INDEX AREA                          │  │
│  │  ┌──────┬──────┬──────┬──────┬──────┬──────┐   │  │
│  │  │ 101  │ 105  │ 109  │ 113  │ 117  │ 121  │   │  │
│  │  │ Blk 0│ Blk 1│ Blk 2│ Blk 3│ Blk 4│ Blk 5│   │  │
│  │  └──────┴──────┴──────┴──────┴──────┴──────┘   │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │            DATA AREA (Sequential Blocks)        │  │
│  │  ┌──────┬──────┬──────┬──────┐                  │  │
│  │  │ 101  │ 102  │ 103  │ 104  │ ← Block 0       │  │
│  │  ├──────┼──────┼──────┼──────┤                  │  │
│  │  │ 105  │ 106  │ 107  │ 108  │ ← Block 1       │  │
│  │  ├──────┼──────┼──────┼──────┤                  │  │
│  │  │ 109  │ 110  │ 111  │ 112  │ ← Block 2       │  │
│  │  └──────┴──────┴──────┴──────┘                  │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │            OVERFLOW AREA                        │  │
│  │  ┌──────┬──────┬──────┬──────┐                  │  │
│  │  │ 104a │ 108a │ 112a │      │ ← Overflow recs │  │
│  │  └──────┴──────┴──────┴──────┘                  │  │
│  └────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### 4.4 Search Algorithm (ISAM)

```
Algorithm ISAM_Search(file, targetKey):
  // Step 1: Search index (binary search possible)
  blockNum = INDEX_SEARCH(file.index, targetKey)

  // Step 2: Read the block
  block = READ_BLOCK(file, blockNum)

  // Step 3: Sequential scan within the block
  for each record in block:
      if record.key == targetKey:
          return record

  // Step 4: If not found, check overflow chain
  overflowPtr = block.overflowPtr
  while overflowPtr ≠ NULL:
      record = READ_OVERFLOW(file, overflowPtr)
      if record.key == targetKey:
          return record
      overflowPtr = record.next

  return NOT_FOUND
```

**Trace — ISAM Search for key = 107:**

```
File Structure:
Index: [101→Blk0, 105→Blk1, 109→Blk2, 113→Blk3]
Block 0: [101, 102, 103, 104]
Block 1: [105, 106, 107, 108]  (target)
Block 2: [109, 110, 111, 112]

Target key = 107

Step 1: Binary search on index
  Low=0, High=3, Mid=1 → index[1].key = 105
  105 ≤ 107, eliminate half
  Low=2, High=3, Mid=2 → index[2].key = 109
  107 < 109 → blockNum = 1

Step 2: Read Block 1: [105, 106, 107, 108]

Step 3: Scan Block 1 sequentially
  Record 0: 105 ≠ 107
  Record 1: 106 ≠ 107
  Record 2: 107 = 107 ✓  →  FOUND

Total operations: 2 index comparisons + 3 record comparisons = 5
(Compare to sequential: would need 7 reads)
```

### 4.5 Insertion in ISAM

```
If new record fits in its home block:
    shift records within block to maintain order
    write updated block

If block is full:
    insert into overflow area
    link from the home block to overflow
```

### 4.6 Deletion in ISAM

```
Algorithm ISAM_Delete(file, targetKey):
  record = ISAM_Search(file, targetKey)

  if found:
      MARK_DELETED(record)    // mark flag, do not physically remove
      return SUCCESS
  else:
      return NOT_FOUND
```

**Note:** Deleted records are marked (not removed) to avoid shifting. Periodic reorganization reclaims space.

### 4.7 Advantages and Disadvantages

| Advantage | Disadvantage |
|---|---|
| Faster than pure sequential (binary search on index) | Index maintenance overhead |
| Supports both sequential and direct access | Overflow area degrades performance over time |
| Efficient for range queries | Periodic reorganization needed |
| Well-suited for disk geometry | Insertions in full blocks go to overflow (slower) |

---

## 5. Linked Organization

### 5.1 Concept

**Definition:** Records are linked together using **pointers** to form lists. Different organizations use different linking strategies to support various query types.

### 5.2 Multi-list Files

**Definition:** A file organized as multiple linked lists. Records are linked by a common attribute value. Each distinct value of an attribute forms its own linked list.

```
Multi-list File — Employee records linked by Department:

┌──────────────────────────────────────────────────┐
│  EMPLOYEE FILE                                   │
├──────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────┐  │
│  │ ID: 101  |  Name: Alice | Dept: IT         │──│──→ IT chain
│  │ DeptPtr: ─────────────────────────────→ 203 │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │ ID: 102  |  Name: Bob   | Dept: HR         │──│──→ HR chain
│  │ DeptPtr: ─────────────────────────────→ 205 │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │ ID: 103  |  Name: Carol | Dept: IT         │  │
│  │ DeptPtr: NULL (end of IT chain)            │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │ ID: 104  |  Name: David | Dept: IT         │──│──→ IT chain
│  │ DeptPtr: ─────────────────────────────→ 103 │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │ ID: 205  |  Name: Eve   | Dept: HR         │  │
│  │ DeptPtr: NULL (end of HR chain)            │  │
│  └────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│  Headers:  IT → [101, 104, 103]                  │
│            HR → [102, 205]                        │
└──────────────────────────────────────────────────┘
```

**Search in Multi-list — Find all IT employees:**

```
Step 1: Get header pointer for IT → 101
Step 2: Read record 101 (Alice, IT)
Step 3: Follow DeptPtr → 104
Step 4: Read record 104 (David, IT)
Step 5: Follow DeptPtr → 103
Step 6: Read record 103 (Carol, IT)
Step 7: DeptPtr = NULL → stop

Result: Alice, David, Carol
```

### 5.3 Coral Rings (Circular Linked Lists)

**Definition:** A variant of multi-list where the last record's pointer points back to the header, forming a **circular** structure.

```
Coral Ring — All IT employees in a circular linked list:

                     ┌──────────────────┐
                     │                  │
                     ▼                  │
  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
  │ 101 (IT)   │→ │ 104 (IT)   │→ │ 103 (IT)   │──┘
  │ DeptPtr ────→│ DeptPtr ────→│ DeptPtr ────→ (back to header)
  └────────────┘  └────────────┘  └────────────┘

  Header (IT) ←──────────────────────────────────────┘
```

**Advantage:** No NULL checks — traversal continues until you return to the start point. Useful for embedded systems where pointer validity is critical.

### 5.4 Inverted Files

**Definition:** For every **non-key attribute** (secondary key), an index is maintained that maps each attribute value to a **list of record IDs (pointers)** containing that value.

```
Inverted File — Library Catalog

MAIN FILE (Book Records):
┌──────┬──────────────────┬───────────┬──────────────┐
│ RecID│ Title            │ Author    │ Subject      │
├──────┼──────────────────┼───────────┼──────────────┤
│ 001  │ Data Structures   │ Tanenbaum │ CS           │
│ 002  │ Algorithms        │ Cormen    │ CS           │
│ 003  │ Database Systems  │ Korth     │ CS           │
│ 004  │ Thermodynamics    │ Cengel    │ Mechanical   │
│ 005  │ Network Security  │ Stallings │ CS           │
│ 006  │ Fluid Mechanics   │ Fox       │ Mechanical   │
│ 007  │ Organic Chemistry │ Morrison  │ Chemistry    │
└──────┴──────────────────┴───────────┴──────────────┘

INVERTED INDICES:

  AUTHOR INDEX:               SUBJECT INDEX:
  Tanenbaum → [001]           CS         → [001, 002, 003, 005]
  Cormen    → [002]           Mechanical → [004, 006]
  Korth     → [003]           Chemistry  → [007]
  Cengel    → [004]
  Stallings → [005]
  Fox       → [006]
  Morrison  → [007]
```

**Search Example:**

```
Query 1: "Find all CS books"
  Lookup subject index: CS → [001, 002, 003, 005]
  Fetch records: 001 (Data Structures), 002 (Algorithms), 003 (DB Systems), 005 (Network Security)

Query 2: "Find books by Cormen"
  Lookup author index: Cormen → [002]
  Fetch: 002 (Algorithms)

Query 3: "Find CS books by Cormen"
  CS  → [001, 002, 003, 005]
  Cormen → [002]
  Intersection → [002] → Algorithms
```

**Structure of an Inverted File:**

```
┌────────────────────────────────────────────────────┐
│              INVERTED FILE STRUCTURE                │
├────────────────────────────────────────────────────┤
│  MAIN FILE (sequential, by primary key)             │
│  ┌──────┬──────────┬───────────┬──────────┐        │
│  │ RecID│ Field A  │ Field B   │ Field C  │        │
│  ├──────┼──────────┼───────────┼──────────┤        │
│  │  001 │ val_A1   │ val_B1    │ val_C1   │        │
│  │  002 │ val_A2   │ val_B2    │ val_C2   │        │
│  └──────┴──────────┴───────────┴──────────┘        │
│                                                      │
│  INVERTED LIST (for one attribute)                   │
│  ┌──────────┬──────────────────────────────────┐     │
│  │ Attribute│ List of Record IDs                │     │
│  │ Value    │                                   │     │
│  ├──────────┼──────────────────────────────────┤     │
│  │ val_A1   │ [001, 005, 012, ...]             │     │
│  │ val_A2   │ [002, 008, 015, ...]             │     │
│  └──────────┴──────────────────────────────────┘     │
└────────────────────────────────────────────────────┘
```

**Advantages of Inverted Files:**
- **Fast partial-match queries** — any attribute can be searched
- **Set operations** (AND, OR, NOT) on record ID lists are fast
- **No sequential scan** needed for non-key searches
- **Ideal for** information retrieval, document search, library systems

**Disadvantages:**
- **Storage overhead** — indices can be larger than the data
- **Update overhead** — inserting/deleting a record requires updating all inverted indices
- **Complex maintenance** — many indices to keep consistent

### 5.5 Multi-list vs Inverted Files

| Dimension | Multi-list | Inverted File |
|---|---|---|
| **Storage of links** | Pointer stored with each record | Separate index structure |
| **Space overhead** | Lower (pointers embedded in records) | Higher (separate indices for each attribute) |
| **Insert/delete cost** | Lower (update one chain) | Higher (update all inverted indices) |
| **Query on non-key** | Follow linked list (sequential) | Direct lookup in index |
| **AND queries** | Traverse multiple lists (complex) | Intersect record ID lists (fast) |
| **OR queries** | Not straightforward | Union of record ID lists |
| **Suitable for** | Few attributes with frequent updates | Many attributes, frequent searches |
| **Example** | Employee database (dept chain) | Library catalog (author, title, subject indices) |

### 5.6 Cellular Partitions

**Definition:** The file is divided into **cells** (also called partitions or buckets). Each cell is a self-contained unit that can be processed independently, enabling parallel access.

```
Cellular Partition:

  FILE
  ┌──────────────────────────────────────────────────────┐
  │                                                       │
  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
  │  │   CELL 0     │  │   CELL 1     │  │   CELL 2     ││
  │  │              │  │              │  │              ││
  │  │ Records 1-100│  │ Records      │  │ Records      ││
  │  │              │  │ 101-200      │  │ 201-300      ││
  │  └──────────────┘  └──────────────┘  └──────────────┘│
  │         ▲                 ▲                 ▲          │
  │         │                 │                 │          │
  │    Processor 0      Processor 1       Processor 2      │
  └──────────────────────────────────────────────────────┘
```

**Key Points:**
- Each cell can be allocated to a separate processor/thread
- Reduces contention in concurrent access
- Used in parallel databases, distributed file systems
- Partitioning can be by key range, hash, or round-robin

---

## 6. Comparison of File Organizations

| Dimension | Sequential | Direct Access | Indexed Sequential | Linked (Multi-list) | Inverted |
|---|---|---|---|---|---|
| **Access method** | Sequential scan | Hash function | Index + sequential | Follow pointers | Index lookup |
| **Search time** | O(N) | O(1) avg | O(log N + B) | O(K) chain length | O(1) per index |
| **Insert cost** | O(N) (rewrite) | O(1) (with collision) | O(1) (or overflow) | O(1) (append chain) | O(N) (update all indices) |
| **Delete cost** | O(N) (rewrite) | O(1) (mark) | O(1) (mark) | O(K) (chain update) | O(N) (update all indices) |
| **Space overhead** | Minimal | Moderate (hash table) | Index space | Pointer per record | Large (inverted indices) |
| **Sequential access** | ✅ Excellent | ❌ Poor | ✅ Good | ❌ Not primary | ❌ Not primary |
| **Random access** | ❌ Poor | ✅ Excellent | ✅ Good | ❌ Poor | ✅ Good |
| **Range queries** | ✅ Good | ❌ Poor | ✅ Good | ❌ Poor | ✅ (after index) |
| **Batch processing** | ✅ Best | ❌ Poor | ✅ Good | ❌ Poor | ❌ Poor |
| **Online/real-time** | ❌ Poor | ✅ Best | ✅ Good | ❌ Poor | ✅ Good |
| **Partial-match queries** | ❌ Sequential scan | ❌ Only on key | ❌ Only on key | ✅ Yes | ✅ Best |
| **Implementation** | Simplest | Moderate | Complex | Moderate | Most complex |

---

## 7. Case Study: External Sort

### 7.1 Problem Statement

**External Sort** is needed when the data to be sorted **does not fit in main memory (RAM)**. Data resides on disk, and the sorting algorithm must minimize disk I/O operations.

```
Scenario:
  File size     = 1 GB
  Available RAM = 100 MB
  → Cannot load entire file into memory for in-place sorting
  → Need external sort using temporary files
```

### 7.2 Phases of External Sort

```
                    ┌──────────────────────┐
                    │  PHASE 1: RUN GEN     │
                    │  Load chunks, sort in  │
                    │  memory, write runs    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  PHASE 2: MERGE       │
                    │  Merge runs together  │
                    │  (2-way or k-way)     │
                    └──────────────────────┘
```

### 7.3 Run Generation

```
Algorithm Generate_Runs(inputFile, bufferSize):
  OPEN inputFile for reading
  runNum = 0

  while not EOF(inputFile):
      buffer = READ_NEXT_N_RECORDS(inputFile, bufferSize)
      SORT(buffer)                          // internal sort
      outputFile = "run_" + runNum
      WRITE(outputFile, buffer)
      runNum++

  CLOSE(inputFile)
  return totalRuns
```

**Example:**

```
Input file: [45, 23, 89, 12, 67, 34, 91, 8, 56, 72, 19, 43]
Buffer size: 4 records
Available RAM: can sort 4 records at a time

Run Generation:
Chunk 1: [45, 23, 89, 12] → sort → Run 0: [12, 23, 45, 89]
Chunk 2: [67, 34, 91, 8]  → sort → Run 1: [8, 34, 67, 91]
Chunk 3: [56, 72, 19, 43] → sort → Run 2: [19, 43, 56, 72]

Output: 3 sorted runs (temporary files)
```

### 7.4 Consequential Processing (2-Way Merge)

**Definition:** Merging two **already sorted** lists/files into a single sorted list.

```
Algorithm Merge_Two_Sorted(file1, file2, outputFile):
  OPEN file1, file2, outputFile
  r1 = READ(file1)
  r2 = READ(file2)

  while not EOF(file1) and not EOF(file2):
      if r1 ≤ r2:
          WRITE(outputFile, r1)
          r1 = READ(file1)
      else:
          WRITE(outputFile, r2)
          r2 = READ(file2)

  // Copy remaining records from file1
  while not EOF(file1):
      WRITE(outputFile, r1)
      r1 = READ(file1)

  // Copy remaining records from file2
  while not EOF(file2):
      WRITE(outputFile, r2)
      r2 = READ(file2)

  CLOSE(file1); CLOSE(file2); CLOSE(outputFile)
```

**Trace — Merge two sorted lists:**

```
List A: [12, 23, 45, 89]
List B: [8, 34, 67, 91]

Step | r1 | r2 | Compare | Write | Output so far
─────┼────┼────┼─────────┼───────┼──────────────
1    | 12 | 8  | 12 > 8  | 8     | [8]
2    | 12 | 34 | 12 ≤ 34 | 12    | [8, 12]
3    | 23 | 34 | 23 ≤ 34 | 23    | [8, 12, 23]
4    | 45 | 34 | 45 > 34 | 34    | [8, 12, 23, 34]
5    | 45 | 67 | 45 ≤ 67 | 45    | [8, 12, 23, 34, 45]
6    | 89 | 67 | 89 > 67 | 67    | [8, 12, 23, 34, 45, 67]
7    | 89 | 91 | 89 ≤ 91 | 89    | [8, 12, 23, 34, 45, 67, 89]
8    | —  | 91 | EOF(A)  | 91    | [8, 12, 23, 34, 45, 67, 89, 91]

Merged result: [8, 12, 23, 34, 45, 67, 89, 91]
```

### 7.5 Multiway Merging — k-Way Merge Algorithm

**Definition:** Merge **k** sorted runs simultaneously in one pass using a **min-heap (priority queue)** of size k.

```
Algorithm K_Way_Merge(runs[], k, outputFile):
  // runs[0..k-1] are pointers to k sorted temporary files
  // Build a min-heap of (value, runIndex) pairs
  CREATE MinHeap of size k

  // Step 1: Initialize — read first record from each run
  for i = 0 to k-1:
      if not EOF(runs[i]):
          record = READ(runs[i])
          MinHeap.INSERT( (record.value, i) )

  // Step 2: Repeatedly extract min, replace from same run
  while MinHeap is not empty:
      (minValue, runIdx) = MinHeap.EXTRACT_MIN()
      WRITE(outputFile, minValue)

      if not EOF(runs[runIdx]):
          nextRecord = READ(runs[runIdx])
          MinHeap.INSERT( (nextRecord.value, runIdx) )

  CLOSE all files
```

**Trace — 3-Way Merge:**

```
Run 0: [12, 45, 78]
Run 1: [8, 34, 91]
Run 2: [23, 56, 67]

Initial heap (value, run):
  ┌─────┬─────┬─────┐
  │ 8,1 │ 12,0│ 23,2│   (8 is smallest)
  └─────┴─────┴─────┘

Step | Extract | From Run | Replace | Heap State        | Output
─────┼─────────┼──────────┼─────────┼───────────────────┼──────────
1    | 8       | 1        | 34,1    | [12,0 34,1 23,2]  | [8]
2    | 12      | 0        | 45,0    | [23,2 34,1 45,0]  | [8, 12]
3    | 23      | 2        | 56,2    | [34,1 45,0 56,2]  | [8, 12, 23]
4    | 34      | 1        | 91,1    | [45,0 56,2 91,1]  | [8, 12, 23, 34]
5    | 45      | 0        | 78,0    | [56,2 78,0 91,1]  | [8, 12, 23, 34, 45]
6    | 56      | 2        | 67,2    | [67,2 78,0 91,1]  | [8, 12, 23, 34, 45, 56]
7    | 67      | 2        | EOF     | [78,0 91,1]       | [8, 12, 23, 34, 45, 56, 67]
8    | 78      | 0        | EOF     | [91,1]            | [8, 12, 23, 34, 45, 56, 67, 78]
9    | 91      | 1        | EOF     | []                | [8, 12, 23, 34, 45, 56, 67, 78, 91]

Final sorted output: [8, 12, 23, 34, 45, 56, 67, 78, 91]
```

### 7.6 Complexity Analysis of External Sort

| Phase | I/O Cost | Explanation |
|---|---|---|
| **Run Generation** | O(N) | Read each record once, write each record once |
| **2-Way Merge** | O(N log R) | R = number of initial runs; merge R runs with log R merge passes |
| **k-Way Merge** | O(N log_k R) | Merge R runs in log_k R merge passes |

**Number of merge passes:**

```
Given:
  N = total records
  B = buffer capacity (records that fit in RAM)
  k = merge order (number of runs merged at once)

Initial runs: R = ⌈N/B⌉

Merge passes needed: ⌈log_k R⌉

Total I/O: N + 2N × (merge_passes)
           (initial write) (each pass reads + writes N records)
```

**Example Calculation:**

```
N = 10⁶ records, B = 10⁴ records
R = ⌈10⁶ / 10⁴⌉ = 100 runs

With k = 2 (2-way merge):
  Merge passes = ⌈log₂ 100⌉ = 7 passes
  Total I/O = N + 2N × 7 = 10⁶ + 14 × 10⁶ = 15 × 10⁶ records read/written

With k = 10 (10-way merge):
  Merge passes = ⌈log₁₀ 100⌉ = 2 passes
  Total I/O = N + 2N × 2 = 10⁶ + 4 × 10⁶ = 5 × 10⁶ records read/written

Savings: 10-way merge uses ⅓ the I/O of 2-way merge!
```

### 7.7 Visual — 2-Way Merge Passes vs k-Way Passes

```
2-Way Merge (k=2):            10-Way Merge (k=10):

  R0 ──┐                       R0 ──┐
  R1 ──┤  Pass 1                R1 ──┤
       ├── M00 ──┐              R2 ──┤
  R2 ──┤         │              R3 ──┤  Pass 1
  R3 ──┘         │              R4 ──┤
                 ├── M000 ──┐   R5 ──┤
  R4 ──┐         │          │   R6 ──┤
  R5 ──┤  Pass 2 │          │   R7 ──┤
       ├── M01 ──┘          │   R8 ──┤
  R6 ──┤                     │   R9 ──┘
  R7 ──┘                     │
                             ├── FINAL
  R8 ──┐                     │
  R9 ──┤  Pass 3             │
       ├── M10 ──┐           │
  R10─┤          │  Pass 4   │
  R11─┘          │           │
                 ├── M100──  ┘
  R12─┐          │
  R13─┤  Pass 3  │
       ├── M11 ──┘
  R14─┤
  R15─┘

k=2: 4 passes for 16 runs
k=10: 2 passes for 100 runs
```

---

## 8. Formula & Complexity Sheet

| Algorithm / Operation | Time Complexity | Space Complexity | Data Structure |
|---|---|---|---|
| Sequential Search | O(N) | O(1) | — |
| Sequential Insert | O(N) | O(N) (temp file) | Temp file |
| Sequential Delete | O(N) | O(N) (temp file) | Temp file |
| Direct Access Read (avg) | O(1) | O(N) | Hash table |
| Direct Access Read (worst) | O(N) — all collide | O(N) | Hash table + chain |
| ISAM Search | O(log I + B) — I=index entries, B=block size | O(I) for index | B-tree / Sparse index |
| ISAM Insert | O(log I + B) (with overflow) | O(I) | Index + overflow area |
| Multi-list Search | O(K) — K = chain length | O(N) | Linked lists |
| Inverted File Lookup | O(1) per attribute + O(M) fetch | O(N + total index entries) | Hash + inverted lists |
| External Sort (run gen) | O(N log B) — internal sort | O(B) buffer | Internal sort |
| 2-Way Merge | O(N log R) I/O ops | O(B) buffer | 2 input + 1 output |
| k-Way Merge | O(N log_k R) I/O ops | O(k + B) | Min-heap of size k |
| k-Way Merge (heap extract) | O(N log k) CPU | O(k) heap | Min-heap |

---

## 9. Expected Exam Questions (Pattern Analysis)

| Question Type | Marks | Frequency |
|---|---|---|
| Explain file organization types with diagram | 6-8 | Very High |
| Compare Sequential, Direct, Indexed Sequential (table) | 4-6 | Very High |
| Explain ISAM structure with diagram and search process | 6 | High |
| Explain external sort with k-way merge algorithm | 6-8 | High |
| Explain inverted file with example and query processing | 4-6 | Medium |
| Explain multi-list file organization with example | 4 | Medium |
| Primitive operations on sequential file (insert/delete) | 4 | High |
| Explain direct file organization with hashing | 4-6 | High |
| Compare multi-list vs inverted files | 4 | Medium |
| What are coral rings? Explain with diagram | 4 | Low |
| Cellular partitions — concept and advantage | 2-4 | Low |
| Write k-way merge algorithm with trace | 6 | Medium |
| Explain consequential processing / merging two lists | 4 | Medium |
| Define: file, record, field, key, primitive operations | 2-4 | High (short notes) |

**Command Words Used:**
- **Define / State** (L1) — 2 marks — terminology (file, record, key)
- **Explain / Describe** (L2) — 4 marks — file organizations, operations
- **Apply / Trace** (L3) — 6 marks — ISAM search, direct access, external sort trace
- **Compare / Differentiate** (L4) — 4 marks — sequential vs direct vs indexed, multi-list vs inverted
- **Analyze / Design** (L4-L5) — 6-8 marks — choose best file organization for given scenario

---

## 10. Rapid Revision — One Page Summary

### TOP 5 DEFINITIONS

1. **File:** Named collection of related records stored on secondary storage
2. **Record:** Collection of related fields (one logical entity)
3. **Primary Key:** Unique field that identifies a record
4. **Index:** Structure that maps keys to record locations for faster access
5. **External Sort:** Sorting algorithm for data larger than available RAM

### TOP 5 KEY POINTS

1. **Sequential:** Records in key order; O(N) search; best for batch processing
2. **Direct Access:** Hash function → O(1) access; collision handling needed
3. **ISAM:** Index (sparse) + sequential data; binary search index → scan block
4. **Inverted File:** Index for every non-key attribute; fast partial-match queries; high update cost
5. **External Sort:** Phase 1 (run generation) + Phase 2 (k-way merge); I/O = N × (1 + 2 × merge_passes)

### QUICK COMPARISONS

| A | B | Key Difference |
|---|---|---|
| Sequential | Direct | O(N) scan vs O(1) hash; batch vs online |
| Sequential | ISAM | No index vs sparse index; O(N) vs O(log I + B) |
| Direct | ISAM | Hash O(1) vs index O(log I); no sequential vs supports sequential |
| Multi-list | Inverted | Embedded pointers vs separate indices; lower vs higher space |
| 2-Way Merge | k-Way Merge | 2 runs at a time vs k runs; more passes vs fewer passes |
| Master File | Transaction File | Permanent current data vs pending changes |

### EXAM PREDICTION

Most likely 8-mark question: **"Explain Indexed Sequential File Organization with structure, diagram, and search procedure."** or **"Explain External Sort with k-way merge algorithm and trace."**

Most likely 6-mark question: **"Compare any three file organizations with advantages and disadvantages."**

Most likely 4-mark question: **"Explain inverted file with example"** or **"Write short note on multi-list files."**

### MUST-KNOW

ISAM structure, Direct file hashing, Sequential file operations (insert/delete), k-way merge algorithm, Comparison tables

### MNEMONICS

**FILE OPS:** **"Open Read Write Seek Close"** → ORWSC (think "Orca Whale SC")

**SEQUENTIAL INSERT:** **"Read until key > new, write new, write rest"** → RINW

**DIRECT ACCESS:** **"Hash the key, handle collision, O(1) retrieval"**

**External Sort Phases:** **"Run then Merge"** (R&M)

**k-Way Merge (heap trick):** **"Extract smallest, replace from same run"** → ESR

---

## 11. Learning Acceleration Footer

| Item | Details |
|---|---|
| **Spaced Repetition Schedule** | D1 | D2 | D4 | D8 | D16 |
| **Top 3 Mnemonics** | "Open Read Write Seek Close" (ORWSC); "Run then Merge" (R&M); "Extract Smallest Replace" (ESR) |
| **Self-Test Questions** | See Section 12 below |
| **Feynman Challenge** | "Explain in one sentence: Why does a k-way merge use fewer I/O operations than 2-way merge?" |
| **Cross-Link** | Unit I (Hashing — direct file uses hash tables); Unit V (Sorting — internal sort used in run generation); Unit II (Linked lists — multi-list files) |
| **Bloom Level Reached** | L4 (Analyze) — Push to L5 by evaluating which file organization is optimal for a given application scenario (e.g., bank transaction system, library catalog, employee payroll batch) |

---

## 12. Self-Test Questions

**Q1:** What is the difference between data and information? Give one example of each.

**Q2:** List the five primitive operations on a file. What does each do?

**Q3:** In a sequential file of 1000 records, how many reads are needed in the worst case to find a record? What about a direct file?

**Q4:** Explain with an example how insertion works in a sequential file. Why must the file be rewritten?

**Q5:** Why does deletion in a direct file use a tombstone marker instead of physically removing the record?

**Q6:** A file has keys = {23, 45, 67, 89, 12, 34, 56}. File size = 10. Use division method h(k) = k MOD 10. Show where each record is placed, handling collisions with linear probing.

**Q7:** In an ISAM file with index entries at keys [100, 200, 300, 400] and blocks of 4 records each, trace the search for key 275. How many index and data reads are needed?

**Q8:** What are the advantages of an indexed sequential file over a pure sequential file? What is the trade-off?

**Q9:** In a multi-list file, how many linked lists exist if there are 5 distinct department values? What does each list connect?

**Q10:** What is the difference between a multi-list file and a coral ring?

**Q11:** Given a library with 10,000 books and frequent searches by author, title, and subject, why is an inverted file the best choice? What is the cost?

**Q12:** Compare inverted files and multi-list files in terms of storage and query speed.

**Q13:** What are cellular partitions? How do they enable parallel processing?

**Q14:** In external sort, if N = 500,000 records, B = 5,000 records (buffer size), how many initial runs are generated? How many merge passes with k=5?

**Q15:** Trace a 3-way merge on the following runs:
- Run 0: [10, 30, 50]
- Run 1: [20, 40, 60]
- Run 2: [15, 35, 55]

Show the heap state after each extraction.

---

**Answers to Selected Questions:**

**Q3:** Sequential worst case = 1000 reads. Direct = 1 read (hash) + possibly few collision probes.

**Q6:**
```
h(23)=3 → free → place at 3
h(45)=5 → free → place at 5
h(67)=7 → free → place at 7
h(89)=9 → free → place at 9
h(12)=2 → free → place at 2
h(34)=4 → free → place at 4
h(56)=6 → free → place at 6
All placed without collision in this case.
```

**Q7:**
```
Index: [100→Blk0, 200→Blk1, 300→Blk2, 400→Blk3]
Binary search: 275 falls between 200 and 300 → block 1
Read block 1 (records 200-203)
Scan: 200, 201, 202, 203 — none is 275 → not found
Total: 2 index comparisons + 4 data comparisons = 6 operations
```

**Q14:**
```
Runs = ⌈500000/5000⌉ = 100 runs
Merge passes with k=5: ⌈log₅ 100⌉ = ⌈2.86⌉ = 3 passes
Total I/O: 500000 + 2×500000×3 = 3,500,000 records
```

---

*End of Unit VI — File Organization Notes*
