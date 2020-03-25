const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3001;
const path = require('path');
const morgan = require('morgan')
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/scheduler';
mongoose.connect(MONGODB_URI, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

console.log(process.env)

require('./routes/index')(app);

app.get("/student", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/public/index.html"));
});

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/public/index.html"));
});

app.listen(PORT, function() {
    console.log(`App listening on PORT: ${PORT}`);
});
