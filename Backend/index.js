const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const app = express();
const fs = require('fs');
const path = require('path');
const { log } = require('console');

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(cors());
// (function getall() {

app.get('/form_data', (req, res) => {
        console.log("dcsbdjsbj");
        var l = JSON.parse(fs.readFileSync('../ajaxcrud/index.json', 'utf8'));

        let maxId = Math.max(...l.map(obj => obj?.id || 0)); // Find the max value of id
        let filteredArray = l.filter(obj => obj.id == maxId);
        let finalId = filteredArray[0]["id"]
        console.log(filteredArray[0]["id"]);
        return res.status(200).json({
                finalId: finalId
        })


})


// })

// })();


// Route to handle form submissions
app.post('/form_data', (req, res) => {
        const formData = req.body;
        let arr = [];
        try {
                const filePath = path.join(__dirname, '../ajaxcrud/index.json');
                console.log(filePath);
                if (fs.existsSync(filePath)) {
                        arr = JSON.parse(fs.readFileSync(filePath));
                }
                // Push new form data into the array
                arr.push(formData);

                // Write updated data to index.json
                fs.writeFile(filePath, JSON.stringify(arr, null, 2), (err) => {
                        if (err) {
                                console.error('Error writing file:', err);
                                return res.status(500).send('Internal Server Error');
                        }
                        console.log('Form data saved successfully:', formData);
                        res.status(200).send('Form data saved successfully');
                });
        } catch (err) {
                console.error('Error:', err);
                res.status(500).send('Internal Server Error');
        }
});

// delete request 

app.delete('/form_data/:id', (req, res) => {
        const idToDelete = req.params.id;
        console.log(idToDelete);
        // Read the JSON file
        fs.readFile('../ajaxcrud/index.json', 'utf8', (err, data) => {
                if (err) {
                        return res.status(500).send('Internal Server Error');
                }

                // Parse the JSON data
                let jsonData = JSON.parse(data);

                // Find the index of the object with matching ID
                const index = jsonData.findIndex(item => item.id === idToDelete);

                // If the ID is found, remove the object from the array
                if (index !== -1) {
                        jsonData.splice(index, 1);

                        // Write the updated data back to the file
                        fs.writeFile('../ajaxcrud/index.json', JSON.stringify(jsonData, null, 2), (err) => {
                                if (err) {
                                        return res.status(500).send('Internal Server Error');
                                }
                                console.log('Data deleted successfully');
                                res.status(200).send('Data deleted successfully');
                        });
                } else {
                        // If ID is not found, return a 404 error
                        res.status(404).send('ID not found');
                }
        });
});


// Start the server
app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
});
