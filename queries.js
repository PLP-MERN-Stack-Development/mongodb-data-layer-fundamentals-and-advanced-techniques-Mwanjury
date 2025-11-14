// queries.js - Comprehensive MongoDB queries for Week 1 Assignment
// This file demonstrates CRUD operations, advanced queries, aggregation pipelines, and indexing

// Load environment variables from .env file
require('dotenv').config();

const { MongoClient } = require('mongodb');

// Connection URI
// For LOCAL MongoDB: 'mongodb://localhost:27017'
// For MONGODB ATLAS: Replace with your connection string from Atlas
// Format: 'mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority'
const uri = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority';

// Database and collection names
const dbName = 'plp_bookstore';
const collectionName = 'books';

// Main function to run all queries
async function runAllQueries() {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('✓ Connected to MongoDB server\n');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // ============================================
    // TASK 2: BASIC CRUD OPERATIONS
    // ============================================
    console.log('╔════════════════════════════════════════════════════╗');
    console.log('║   TASK 2: BASIC CRUD OPERATIONS                   ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    // 1. Find all books in a specific genre
    console.log('1. Find all books in the "Fiction" genre:');
    const fictionBooks = await collection.find({ genre: 'Fiction' }).toArray();
    console.log(`   Found ${fictionBooks.length} books:`, fictionBooks.map(b => b.title));

    // 2. Find books published after a certain year
    console.log('\n2. Find all books published after 1950:');
    const recentBooks = await collection.find({ published_year: { $gt: 1950 } }).toArray();
    console.log(`   Found ${recentBooks.length} books:`, recentBooks.map(b => `${b.title} (${b.published_year})`));

    // 3. Find books by a specific author
    console.log('\n3. Find all books by "George Orwell":');
    const orwellBooks = await collection.find({ author: 'George Orwell' }).toArray();
    console.log(`   Found ${orwellBooks.length} books:`, orwellBooks.map(b => b.title));

    // 4. Update the price of a specific book
    console.log('\n4. Update price of "To Kill a Mockingbird" to $14.99:');
    const updateResult = await collection.updateOne(
      { title: 'To Kill a Mockingbird' },
      { $set: { price: 14.99 } }
    );
    console.log(`   Updated ${updateResult.modifiedCount} document(s)`);
    const updatedBook = await collection.findOne({ title: 'To Kill a Mockingbird' });
    console.log(`   New price: $${updatedBook.price}`);

    // 5. Delete a book by its title
    console.log('\n5. Deleting "Wuthering Heights" (will be restored):');
    const deleteResult = await collection.deleteOne({ title: 'Wuthering Heights' });
    console.log(`   Deleted ${deleteResult.deletedCount} document(s)`);

    // Restore the deleted book
    await collection.insertOne({
      title: 'Wuthering Heights',
      author: 'Emily Brontë',
      genre: 'Gothic Fiction',
      published_year: 1847,
      price: 9.99,
      in_stock: true,
      pages: 342,
      publisher: 'Thomas Cautley Newby'
    });
    console.log('   ↓ (Book restored for further queries)');

    // ============================================
    // TASK 3: ADVANCED QUERIES
    // ============================================
    console.log('\n\n╔════════════════════════════════════════════════════╗');
    console.log('║   TASK 3: ADVANCED QUERIES                        ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    // 1. Find books that are both in stock and published after 2010
    console.log('1. Find books in stock AND published after 2010:');
    const inStockRecent = await collection
      .find({ 
        in_stock: true, 
        published_year: { $gt: 2010 } 
      })
      .toArray();
    console.log(`   Found ${inStockRecent.length} books:`, inStockRecent.map(b => b.title));

    // 2. Use projection to return only title, author, and price
    console.log('\n2. Find all books with projection (title, author, price only):');
    const projectionResult = await collection
      .find({})
      .project({ title: 1, author: 1, price: 1, _id: 0 })
      .limit(3)
      .toArray();
    console.log('   First 3 books:');
    projectionResult.forEach(book => {
      console.log(`   - ${book.title} by ${book.author}: $${book.price}`);
    });

    // 3. Sorting by price (ascending)
    console.log('\n3. Books sorted by price (ascending):');
    const sortedAsc = await collection
      .find({})
      .project({ title: 1, price: 1, _id: 0 })
      .sort({ price: 1 })
      .limit(5)
      .toArray();
    console.log('   Top 5 cheapest books:');
    sortedAsc.forEach(book => {
      console.log(`   - ${book.title}: $${book.price}`);
    });

    // 4. Sorting by price (descending)
    console.log('\n4. Books sorted by price (descending):');
    const sortedDesc = await collection
      .find({})
      .project({ title: 1, price: 1, _id: 0 })
      .sort({ price: -1 })
      .limit(5)
      .toArray();
    console.log('   Top 5 most expensive books:');
    sortedDesc.forEach(book => {
      console.log(`   - ${book.title}: $${book.price}`);
    });

    // 5. Pagination (5 books per page)
    console.log('\n5. Pagination example (5 books per page):');
    const pageSize = 5;
    const page1 = await collection
      .find({})
      .project({ title: 1, _id: 0 })
      .limit(pageSize)
      .toArray();
    console.log('   Page 1:');
    page1.forEach((book, idx) => console.log(`   ${idx + 1}. ${book.title}`));

    const page2 = await collection
      .find({})
      .project({ title: 1, _id: 0 })
      .skip(pageSize)
      .limit(pageSize)
      .toArray();
    console.log('   Page 2:');
    page2.forEach((book, idx) => console.log(`   ${idx + 1}. ${book.title}`));

    // ============================================
    // TASK 4: AGGREGATION PIPELINES
    // ============================================
    console.log('\n\n╔════════════════════════════════════════════════════╗');
    console.log('║   TASK 4: AGGREGATION PIPELINES                   ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    // 1. Calculate average price by genre
    console.log('1. Average price of books by genre:');
    const avgPriceByGenre = await collection
      .aggregate([
        {
          $group: {
            _id: '$genre',
            averagePrice: { $avg: '$price' },
            count: { $sum: 1 }
          }
        },
        { $sort: { averagePrice: -1 } }
      ])
      .toArray();
    avgPriceByGenre.forEach(genre => {
      console.log(`   ${genre._id}: $${genre.averagePrice.toFixed(2)} (${genre.count} books)`);
    });

    // 2. Find the author with the most books
    console.log('\n2. Author with the most books:');
    const authorBookCount = await collection
      .aggregate([
        {
          $group: {
            _id: '$author',
            bookCount: { $sum: 1 },
            books: { $push: '$title' }
          }
        },
        { $sort: { bookCount: -1 } },
        { $limit: 1 }
      ])
      .toArray();
    if (authorBookCount.length > 0) {
      const top = authorBookCount[0];
      console.log(`   ${top._id}: ${top.bookCount} books`);
      console.log(`   Books: ${top.books.join(', ')}`);
    }

    // 3. Group books by publication decade and count
    console.log('\n3. Books grouped by publication decade:');
    const decadeGrouping = await collection
      .aggregate([
        {
          $group: {
            _id: {
              $floor: { $divide: ['$published_year', 10] }
            },
            decade: {
              $first: {
                $concat: [
                  { $toString: { $multiply: [{ $floor: { $divide: ['$published_year', 10] } }, 10] } },
                  's'
                ]
              }
            },
            count: { $sum: 1 },
            books: { $push: '$title' }
          }
        },
        { $sort: { _id: 1 } }
      ])
      .toArray();
    decadeGrouping.forEach(decade => {
      console.log(`   ${decade.decade}: ${decade.count} book(s)`);
      console.log(`      → ${decade.books.join(', ')}`);
    });

    // ============================================
    // TASK 5: INDEXING
    // ============================================
    console.log('\n\n╔════════════════════════════════════════════════════╗');
    console.log('║   TASK 5: INDEXING & PERFORMANCE                  ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    // 1. Create index on title field
    console.log('1. Creating index on "title" field...');
    const titleIndexName = await collection.createIndex({ title: 1 });
    console.log(`   ✓ Index created: ${titleIndexName}`);

    // 2. Create compound index on author and published_year
    console.log('\n2. Creating compound index on "author" and "published_year"...');
    const compoundIndexName = await collection.createIndex({ author: 1, published_year: 1 });
    console.log(`   ✓ Index created: ${compoundIndexName}`);

    // 3. Get all indexes
    console.log('\n3. All indexes on "books" collection:');
    const indexes = await collection.listIndexes().toArray();
    indexes.forEach(index => {
      console.log(`   - ${index.name}:`, index.key);
    });

    // 4. Performance comparison with explain()
    console.log('\n4. Performance analysis using explain():\n');

    // Query without index (or with existing index)
    console.log('   Query: Find books by title "1984"');
    const explainResult = await collection
      .find({ title: '1984' })
      .explain('executionStats');
    console.log('   Execution Stats:');
    console.log(`   - Documents examined: ${explainResult.executionStats.totalDocsExamined}`);
    console.log(`   - Documents returned: ${explainResult.executionStats.nReturned}`);
    console.log(`   - Execution time: ${explainResult.executionStats.executionStages.stage}`);
    console.log(`   - Using index: ${explainResult.executionStats.executionStages.stage !== 'COLLSCAN' ? 'YES ✓' : 'NO'}`);

    console.log('\n   Query: Find books by author "J.R.R. Tolkien" published after 1950');
    const explainResult2 = await collection
      .find({ author: 'J.R.R. Tolkien', published_year: { $gt: 1950 } })
      .explain('executionStats');
    console.log('   Execution Stats:');
    console.log(`   - Documents examined: ${explainResult2.executionStats.totalDocsExamined}`);
    console.log(`   - Documents returned: ${explainResult2.executionStats.nReturned}`);
    console.log(`   - Using index: ${explainResult2.executionStats.executionStages.stage !== 'COLLSCAN' ? 'YES ✓' : 'NO'}`);

    console.log('\n\n╔════════════════════════════════════════════════════╗');
    console.log('║   ✓ ALL QUERIES COMPLETED SUCCESSFULLY!           ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Close the connection
    await client.close();
    console.log('✓ MongoDB connection closed');
  }
}

// Run all queries
runAllQueries().catch(console.error);

/*
 * QUICK REFERENCE - MongoDB Query Examples
 * 
 * Basic CRUD:
 * - db.books.find({ genre: "Fiction" })
 * - db.books.find({ published_year: { $gt: 1950 } })
 * - db.books.find({ author: "George Orwell" })
 * - db.books.updateOne({ title: "..." }, { $set: { price: 15.99 } })
 * - db.books.deleteOne({ title: "..." })
 * 
 * Advanced Queries:
 * - db.books.find({ in_stock: true, published_year: { $gt: 2010 } })
 * - db.books.find({}, { title: 1, author: 1, price: 1 }).sort({ price: 1 }).limit(5)
 * - db.books.find({}).sort({ price: -1 }).skip(5).limit(5)
 * 
 * Aggregation:
 * - db.books.aggregate([{ $group: { _id: "$genre", avg: { $avg: "$price" } } }])
 * - db.books.aggregate([{ $group: { _id: "$author", count: { $sum: 1 } } }])
 * 
 * Indexing:
 * - db.books.createIndex({ title: 1 })
 * - db.books.createIndex({ author: 1, published_year: 1 })
 * - db.books.getIndexes()
 * - db.books.find({ title: "1984" }).explain("executionStats")
 */
