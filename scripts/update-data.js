// update json 데이터 createAt 데이터
const fs = require('fs');
const path = require('path');

const updateDates = (jsonFile) => {
    const dataFile = path.resolve(__dirname, `../src/${jsonFile}`);
    const docsDir = path.resolve(__dirname, '../public/docs');

    // Check if the file exists before reading
    if (!fs.existsSync(dataFile)) {
        console.error(`File not found: ${dataFile}`);
        return;
    }

    let data;
    try {
        data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    } catch (e) {
        console.error(`Could not parse the file: ${dataFile}`, e.message);
        return;
    }

    for (const item of data) {
        // Strip out any redundant "/docs" prefix since we are already pointing inside public/docs/
        const relativePagePath = item.Page.replace(/^\/docs\//, '/');
        const mdFile = path.join(docsDir, relativePagePath);

        let dateStr = '';

        try {
            const stat = fs.statSync(mdFile);
            dateStr = stat.birthtime.toISOString();
        } catch (e) {
            console.warn(`Could not get date for ${mdFile}`, e.message);
            dateStr = new Date().toISOString(); // fallback to today
        }

        // Format date string from "YYYY-MM-DDTXX:XX:XX" to "YYYY-MM-DD"
        item.createdAt = dateStr.split('T')[0];
    }

    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${jsonFile} with file creation dates from public/docs`);
};

// Execute for both target JSON files
updateDates('post-data.json');
updateDates('life-data.json');
