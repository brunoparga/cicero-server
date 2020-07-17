const fs = require('fs');

const { compare, deduplicate, buildWord } = require('./helpers');

const words = fs
  // Read the file, break it into lines, throw the header line away
  .readFileSync('./utils/readDiederich/diederich.txt', 'utf8').split('\r\n').slice(1)
  // Break each row into columns, discard all except lemma and definition
  .map((ary) => ary.split('\t').slice(4))
  // Alphabetize by cleaned-up definition
  .sort(compare)
  // Remove duplicates
  .filter(deduplicate)
  // Turn into an object for JSONification
  .map(buildWord);

fs.writeFileSync('./utils/db.json', JSON.stringify(words, null, 2));
