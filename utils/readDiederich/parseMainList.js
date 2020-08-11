const fs = require('fs');

const { compare, deduplicate } = require('./helpers');
const buildWord = require('./buildWord');

const words = fs
  // Read the file, break it into lines, throw the header line away
  .readFileSync('./utils/readDiederich/diederich.txt', 'utf8').split('\r\n').slice(1)
  // TODO: remove lines that are comments
  .filter((line) => !/^\//.test(line))
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
if (fs.readFileSync('./utils/db.json', 'utf8') !== json) {
  fs.writeFileSync('./utils/db.json', json);
}
