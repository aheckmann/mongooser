module.exports = {
    connect: 'mongodb://localhost:27017/testing_repl'
  , Book: [{title:String}, {collection: 'mybookcollection'}]
  , Page: './schemas/page.js'
  , Order: './models/order.js'
}
