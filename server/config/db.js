import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
    const uri = process.env.URI;
  try {
      await mongoose.connect(uri, {
          useCreateIndex: true,
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useFindAndModify: false
      });
      console.log('FastFood database connected...');
  } catch (e) {
      console.error(e.message);
      process.exit(1);
  }
};

export default connectDB;