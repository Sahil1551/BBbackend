  const express =require('express')
  const mongoose=require('mongoose')
  const cors=require('cors')

  const fileUpload = require('express-fileupload');
  const dotenv=require('dotenv')
  dotenv.config()
  const app=express();

  //Middleware
  app.use(fileUpload({
    useTempFiles: true
  }));
  const allowedOrigins = ['https://backend-delta-topaz.vercel.app', 'https://frontend-snowy-pi-75.vercel.app','http://localhost:5173'];

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }));
  app.use(express.json())

  //Mongo Db Conncetion

  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB failed to connect", err);
  });
  // Routes
  app.use('/user',require('./Routes/UserRoutes'));
  app.use('/api',require('./Routes/Category'))
  app.use('/api',require('./Routes/Contact'))
  app.use('/api',require('./Routes/Review'))
  app.use('/api',require('./Routes/ProductRoutes'))
  app.use('/api',require('./Routes/upload'))
