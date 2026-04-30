
"use strict";

let submissions = [
    
    { name: "Moved On", number: 12340000000 },
    { name: "Student Loans", number: 1000000000 },
    { name: "Fell Asleep", number: 555500000 },
    { name: "Grass Allergy", number: 69000000 },
    { name: "Bum Bean", number: 4200000 },
    { name: "Idle Guy", number: 133700 },
    { name: "Left Computer On", number: 19840 },
    { name: "Into The Rabbit Hole", number: 2026 },
    { name: "Steve", number: 101 }

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
        name: req.body.author,
        number: req.body.number
    };

    submissions.push(newSubmission);
    order();
});

function order(){
    for (let i = 0; i < submissions.length - 1; i++) {
        for (let j = 0; j < submissions.length - i - 1; j++) {
        if (submissions[j].number < submissions[j + 1].number) {
        let temp = submissions[j];
        submissions[j] = submissions[j + 1];
        submissions[j + 1] = temp;
        }
    }
    }
}

function contains(name){
    
}
    
    // ---- Your endpoints go above this line ----
    
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

