
"use strict";

let submissions = [
    
    { name: "Allergic to Grass", number: 10000000 },
    { name: "Discord Mod", number: 1000000 },
    { name: "Idle Guy", number: 100000 },
    { name: "Left Computer On", number: 10000 },
    { name: "Into The Rabbit Hole", number: 1000 },
    { name: "Joshua", number: 100}

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

