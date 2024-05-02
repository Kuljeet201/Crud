const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
const { log } = require('console');

const PORT = process.env.PORT || 3000;
console.log(process.env.PORT);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(cors());

// api for dynamic ids

app.get('/gererate_dynamic_id', (req, res) => {
        const data = JSON.parse(fs.readFileSync('../Frontend/index.json', 'utf8'));
        const latestId = Math.max(...data.map(obj => obj.id), 0);
        res.status(200).json({ latestId });
});


// Route to handle form submissions

app.post('/create_form_data', (req, res) => {

        const formData = req.body;
        let arr = [];
        try {
                const filePath = path.join(__dirname, '../Frontend/index.json');
                if (fs.existsSync(filePath)) {
                        arr = JSON.parse(fs.readFileSync(filePath));
                }
                arr.push(formData);

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

// update data

app.put('/update_form_data/:id', (req, res) => {
        const idToUpdate = req.params.id;
        const updatedData = req.body;

        fs.readFile('../Frontend/index.json', 'utf8', (err, data) => {
                if (err) {
                        console.error('Error reading file:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                }

                let formData = JSON.parse(data);

                const index = formData.findIndex(item => item.id == idToUpdate);
                if (index === -1) {
                        return res.status(404).json({ error: 'Data not found' });
                }

                const updatedEntry = { ...formData[index], ...updatedData }; // Merge existing data with updated fields

                if (updatedEntry.Department === undefined || updatedEntry.Work === undefined || updatedEntry.Experience === undefined) {
                        return res.status(400).json({ error: 'Invalid data format' });
                }

                formData[index] = updatedEntry;

                fs.writeFile('../Frontend/index.json', JSON.stringify(formData, null, 2), 'utf8', (err) => {
                        if (err) {
                                console.error('Error writing file:', err);
                                return res.status(500).json({ error: 'Internal server error' });
                        }
                        res.status(200).json({ message: 'Data updated successfully' });
                });
        });
});

// delete request 

app.delete('/delete_form_data/:id', (req, res) => {

        const idToDelete = req.params.id;

        fs.readFile('../Frontend/index.json', 'utf8', (err, data) => {
                if (err) {
                        return res.status(500).send('Internal Server Error');
                }

                let jsonData = JSON.parse(data);

                const index = jsonData.findIndex(item => item.id === idToDelete);

                if (index !== -1) {
                        jsonData.splice(index, 1);

                        fs.writeFile('../Frontend/index.json', JSON.stringify(jsonData, null, 2), (err) => {
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
