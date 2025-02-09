const csvtojson = require('csvtojson');
const fs = require('fs');

// Define file paths
const csvFilePath = 'ALAMEDA_PD_tremor_dataset.csv';
const jsonFilePath = 'new_PD_tremor_dataset.json';

// Convert CSV to JSON and save it to a file
csvtojson()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        // Write JSON to a file
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj, null, 4));
        console.log('CSV successfully converted to JSON and saved.');
    })
    .catch((error) => {
        console.error('Error converting CSV to JSON:', error);
    });
