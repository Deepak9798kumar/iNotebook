const dbConnect = require('./db');
const express = require('express');
const cors = require('cors')


dbConnect();
const app = express()
const port = 8000

app.use(cors())
app.use(express.json())
//Available Routes

app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes' , require('./routes/notes'))

app.listen(port, () => {
  console.log(`App Listening at port ${port}`)
})