// These are the words which would otherwise be misclassified, sent into the wrong part of speech.

const twoPartsOfSpeech = {
  // TODO: getting options doesn't work with these words (two parts of speech)
  // These are the only words in the DB that share these parts of speech
  'satis <INDECL>': 'Adjective, Adverb',
  'nec <ALT: neque>': 'Adverb, Conjunction',
  'ubī <ALT: ubi>': 'Adverb, Conjunction',
  ante: 'Adverb, Preposition',
  ergō: 'Conjunction, Preposition',
};

const adjectives = [
  // three commas in the lemma classifies as verb
  'parvus, -a, -um (comp. minor, superl. minimus)',
  // definition beginning with 'to ' classifies as verb
  'potior, -ius',
  // 'num.' classifies as numeral
  'quot <INDECL>',
  // lack of hyphen in lemma classifies as adverb (default)
  'ācer, ācris, ācre',
  'āter, ātra, ātrum',
  'dīs, dītis',
  'māior, māius',
  'minor, minus',
  'pār, paris',
  'plūs, plūris',
  'prior, prius',
];

const conjunctions = [
  // Classified as adverbs
  'igitur',
  'nēve <ALT: neu>',
  'quasi',
  'sīve ... sīve',
  'vel ... vel',
];

const nouns = [
  // Their odd declensions cause these to be misclassified
  'mīlle',
  'nēmō <DN: nūllīus, nēminī, nēminem, nūllō>',
  'rēs pūblica, reī pūblicae, etc.',
];

const pronouns = [
  // Most of these classify as adverbs, a few as verbs because the gloss begins with 'to ' or
  // due to commas splitting the lemma into four parts like verbs
  'cui',
  'egō <ALT: ego>',
  'hic, haec, hoc',
  'ille, illa, illud',
  'ipse, ipsa, ipsum',
  'mē',
  'mihi',
  'nihil INDECL <ALT: nīl>',
  'nōbīs',
  'nōs',
  'quī, quis',
  'quīlibet, quaelibet, quidlibet (subst., quodlibet, adj.)',
  'quisnam, quidnam',
  'quisquis, quidquid/quicquid (subst., quodquod, adj.)',
  'sibi',
  'tē',
  'tibi',
  'tū',
  'uterque, utraque, utrumque',
  'vōbīs',
  'vōs',
];

// The calling function needs this format
const listToObject = (list, group) => list.reduce((obj, word) => ({ ...obj, [word]: group }), {});

// Object that informs the classifier function of where to put each of these 'hard' words
module.exports = {
  ...twoPartsOfSpeech,
  ...listToObject(adjectives, 'Adjective'),
  ...listToObject(conjunctions, 'Conjunction'),
  ...listToObject(nouns, 'Noun'),
  ...listToObject(pronouns, 'Pronoun'),
};
