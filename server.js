const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
// console.log(process.env)

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
.then((con) => {
  // console.log(con.connection)
  console.log(process.env.NODE_ENV);
});

// START
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started, running on port ${port}...`);
});






// const testPost = new Post({
//   title: 'Test',
//     text: 'TEXT',
//     author: 'me',
//   });
  // testPost
  //   .save()
  //   .then((doc) => {
    //     console.log(doc);
    //   })
//   .catch((err) => console.log(err));