const fs = require('fs');

const { compare, deduplicate } = require('./helpers');
const buildWord = require('./buildWord');

const words = fs
  // Read the file, break it into lines, throw the header line away
  .readFileSync('./utils/readDiederich/diederich.txt', 'utf8').split('\r\n').slice(1)
  // Break each row into columns, discard all except lemma and definition
  .map((ary) => ary.split('\t').slice(4))
  // Alphabetize by cleaned-up definition
  .sort(compare)
  // Remove duplicates
  .filter(deduplicate)
  // Perhaps worth noting: the set of chars /A-Za-zāēīōū().,;\-\/ / is the alphabet for the file
  // Turn into an object for JSONification
  .map(buildWord);

const json = JSON.stringify(words, null, 2);
const file = './utils/db.json';
if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== json) {
  fs.writeFileSync(file, json);
}
