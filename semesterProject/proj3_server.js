
"use strict";

let submissions = [
    { name: "Allergic to Grass", number: 10000 },
];
 
const express = require('express');
const cors = require('cors');
const app = express();
    
// Serve static files from the 'public' folder
app.use(express.static('public'));
    
// Parse JSON request bodies (needed for POST)
app.use(express.json());
app.use(cors());
    
// ---- Your endpoints go below this line ----
    
app.get('/api/submissions', (req, res) =>{
    res.type('json').send(submissions);
});

app.post('/api/submissions', (req, res) =>{
    let newSubmission = {
        name: "You",
        number: 10
    };
    submissions.push(newSubmission);
});
    
    // ---- Your endpoints go above this line ----
    
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

