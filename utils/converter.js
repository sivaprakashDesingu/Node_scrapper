const fs = require('fs');
//const getResults = require('../scraper');
const getResults = require('../scrapper/scraper-allrecipe-site');

(async () => {
    let results = await getResults()
    let jsonString = JSON.stringify(results);
    fs.writeFileSync('../output.json', jsonString, 'utf-8');
})()
