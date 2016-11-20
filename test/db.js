
const db = require('../public/javascripts/db');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
});
rl.prompt();

rl.on('line', (input) => {
    console.info(`Processing: ${input}`);
    db.query(input, result => {
        console.log(result);
        rl.prompt();
    });
}).on('close', () => {
    db.disConnect();
    console.info('Have a great day!');
    process.exit(0);
});
