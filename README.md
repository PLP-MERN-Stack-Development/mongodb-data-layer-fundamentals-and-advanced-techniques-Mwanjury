# MongoDB Fundamentals - Week 1

## 📋 Overview

This project demonstrates MongoDB fundamentals including database setup, CRUD operations, advanced queries, aggregation pipelines, and indexing strategies.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

1. **MongoDB Community Edition** - [Installation Guide](https://www.mongodb.com/docs/manual/administration/install-community/)
2. **MongoDB Shell (mongosh)** - Included with MongoDB Community Edition
3. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)

## ⚙️ Initial Setup

### Option 1: Using MongoDB Atlas (Cloud) - Recommended

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Sign Up" and create a free account
   - Verify your email

2. **Create a Cluster:**
   - Click "Create a Deployment"
   - Select "M0 Shared" (Free tier)
   - Choose your preferred region
   - Click "Create Deployment"
   - Wait 1-2 minutes for the cluster to be created

3. **Get Your Connection String:**
   - Go to "Database" → "Clusters"
   - Click "Connect" on your cluster
   - Select "Drivers"
   - Choose "Node.js" and version 5.x
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`)

4. **Set Up Environment Variable:**
   - Create a `.env` file in your project root (copy from `.env.example`)
   - Replace the placeholder with your actual connection string:
     ```
     MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/?retryWrites=true&w=majority
     ```

5. **Install dependencies:**
   ```bash
   npm install
   ```

6. **Run your scripts:**
   ```bash
   npm run insert
   npm run queries
   ```

### Option 2: Using Local MongoDB

1. **Install MongoDB Community Edition** - [Installation Guide](https://www.mongodb.com/docs/manual/administration/install-community/)

2. **Start MongoDB service:**
   ```bash
   mongod
   ```

3. **Update connection string (optional):**
   - Scripts will automatically use local MongoDB if `MONGODB_URI` is not set
   - Default: `mongodb://localhost:27017`

4. **Run your scripts:**
   ```bash
   npm install
   npm run insert
   npm run queries
   ```

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- Either MongoDB Atlas account (recommended) or local MongoDB installation

## 🚀 Running the Scripts

### Step 1: Populate Database with Sample Data
Run the `insert_books.js` script to insert 12 book documents into the database:

```bash
npm run insert
```

or

```bash
node insert_books.js
```

**Expected Output:**
- ✓ Connected to MongoDB server
- ✓ 12 books inserted successfully
- List of all inserted books

### Step 2: Run MongoDB Queries
Run the `queries.js` script to execute all CRUD operations, advanced queries, aggregation pipelines, and indexing examples:

```bash
npm run queries
```

or

```bash
node queries.js
```

**Expected Output:**
The script will demonstrate:
- **TASK 2**: Basic CRUD operations (Find, Update, Delete)
- **TASK 3**: Advanced queries (filtering, projection, sorting, pagination)
- **TASK 4**: Aggregation pipelines (grouping, averaging, counting)
- **TASK 5**: Indexing and performance analysis

## 📁 Files Included

- **`insert_books.js`** - Populates the `plp_bookstore` database with 12 sample books
- **`queries.js`** - Comprehensive MongoDB query demonstrations
- **`package.json`** - Project dependencies and npm scripts
- **`Week1-Assignment.md`** - Detailed assignment requirements
- **`README.md`** - This file
- **`examples/`** - Additional MongoDB connection examples

## 📊 Database Schema

The `books` collection contains the following fields:
- `title` (string) - Book title
- `author` (string) - Author name
- `genre` (string) - Genre/category
- `published_year` (number) - Publication year
- `price` (number) - Book price in USD
- `in_stock` (boolean) - Availability status
- `pages` (number) - Number of pages
- `publisher` (string) - Publishing company

## ✨ Features Demonstrated

### Task 1: Database Setup
- Created `plp_bookstore` database
- Created `books` collection
- Populated with 12 book documents

### Task 2: CRUD Operations
- ✓ Find books by genre
- ✓ Find books by publication year
- ✓ Find books by author
- ✓ Update book prices
- ✓ Delete books

### Task 3: Advanced Queries
- ✓ Complex filtering (multiple conditions)
- ✓ Projection (selected fields only)
- ✓ Sorting (ascending & descending)
- ✓ Pagination (limit & skip)

### Task 4: Aggregation Pipelines
- ✓ Calculate average price by genre
- ✓ Find author with most books
- ✓ Group books by publication decade

### Task 5: Indexing
- ✓ Single field index on `title`
- ✓ Compound index on `author` and `published_year`
- ✓ Performance analysis using `explain()`

## 🔍 Quick MongoDB Commands

For manual MongoDB Shell queries, connect to mongosh and use:

```javascript
// Switch to database
use plp_bookstore

// View all collections
show collections

// Find all books
db.books.find()

// Find books by genre
db.books.find({ genre: "Fiction" })

// Find books published after 1950
db.books.find({ published_year: { $gt: 1950 } })

// Update a book price
db.books.updateOne({ title: "1984" }, { $set: { price: 11.99 } })

// Delete a book
db.books.deleteOne({ title: "Old Book Title" })

// View indexes
db.books.getIndexes()
```

## 📚 Assignment Tasks Completed

- [x] Task 1: MongoDB Setup
- [x] Task 2: Basic CRUD Operations
- [x] Task 3: Advanced Queries
- [x] Task 4: Aggregation Pipelines
- [x] Task 5: Indexing

## 🐛 Troubleshooting

### "Cannot find module 'mongodb'"
```bash
npm install mongodb
```

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify connection string in `insert_books.js` (default: `mongodb://localhost:27017`)

### Port Already in Use
- Change MongoDB port or stop conflicting services
- MongoDB default port: 27017

## 📝 Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/)
- [MongoDB Node.js Driver](https://mongodb.github.io/node-mongodb-native/)
- [MongoDB Shell Reference](https://www.mongodb.com/docs/mongodb-shell/)

## 📦 Dependencies

- `mongodb@^6.3.0` - MongoDB Node.js driver

## 👤 Author

PLP MERN Stack Development Course - Week 1 Assignment 