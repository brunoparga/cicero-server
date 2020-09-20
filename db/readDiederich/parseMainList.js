const fs = require('fs');

const { compare, deduplicate } = require('./helpers');
const buildWord = require('./buildWord');

const words = fs
  // Read the file, break it into lines, throw the header line away
  .readFileSync('./db/readDiederich/diederich.txt', 'utf8').split('\r\n').slice(1)
  // Break each row into columns, discard all except lemma and definition
  .map((ary) => ary.split('\t').slice(4))
  // Alphabetize by cleaned-up definition
  .sort(compare)
  // Remove duplicates
  .filter(deduplicate)
  // Turn into an object for JSONification
  .map(buildWord);

// Write parsed contents of the word list into a file to be read by the seeding function
const json = JSON.stringify(words, null, 2);
const file = './db/db.json';
if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== json) {
  fs.writeFileSync(file, json);
}
