
const fs = require('fs');
const path = './messages/ar.json';

const content = fs.readFileSync(path, 'utf8');

try {
    JSON.parse(content);
    console.log('Original content is Valid JSON');
} catch (e1) {
    console.log('Original content invalid:', e1.message);

    try {
        JSON.parse(content + '}');
        console.log('SUCCESS: Content becomes valid by extracting one }');
    } catch (e2) {
        try {
            JSON.parse(content.replace(/,(\s*})$/, '$1')); // Try removing trailing comma
            console.log('SUCCESS: Content becomes valid by removing trailing comma');
        } catch (e3) {
            // Try adding }
            try {
                JSON.parse(content + '}');
                console.log('SUCCESS: Content becomes valid by adding one }');
            } catch (e4) {
                console.log('Still invalid after adding }.');
            }
        }
    }
}

// Print end of file codes
const tail = content.slice(-50);
console.log('Tail hex codes:');
for (let i = 0; i < tail.length; i++) {
    process.stdout.write(tail.charCodeAt(i).toString(16) + ' ');
}
console.log('');
