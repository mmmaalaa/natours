import mongoose from 'mongoose';
import app from './index.js';

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log('DB connected sucessfully');
  })
  .catch((err) => {
    console.log('failed to connectDB', err.message);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
