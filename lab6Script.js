document.getElementById("sienaForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Stop the form from submitting automatically
    
    // Get form values
    const email = document.getElementById("emailAddress").value;
    const sienaID = document.getElementById("sienaID").value;
    
    // Log to console (or do whatever you need with the data)
    console.log("Form submitted successfully!");
    console.log("Email:", email);
    console.log("Siena ID:", sienaID);
});