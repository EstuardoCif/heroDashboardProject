const express = require('express');
const mongoose = require('mongoose');
const heroRoutes = require('./routes/heroRoutes');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/heroes', heroRoutes);

//Conexión con MongoDB
mongoose.connect('mongodb+srv://ubiquo:55O85Wh%40b6%401GTQO%24%24XbO9@atlascluster.1jpotvm.mongodb.net/heroes?retryWrites=true&w=majority', 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
