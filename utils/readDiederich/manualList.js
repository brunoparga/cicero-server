// Why each group of words is here

const uniqueWords = {
  // TODO: getting options doesn't work with these words (two parts of speech)
  // Only words that share these parts of speech
  'satis <INDECL>': 'Adjective, Adverb',
  'nec[neque]': 'Adverb, Conjunction',
  'ubī[ubi]': 'Adverb, Conjunction',
  ergō: 'Conjunction, Preposition',
  // Two parts of speech listed separately
  ante: 'Adverb, Preposition',
  // Unusual declensions
  mīlle: 'Noun',
  'rēs pūblica, reī pūblicae, etc.': 'Noun',
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
  'nēve[neu]',
  'quasi',
  'sīve ... sīve',
  'vel ... vel',
];

const pronouns = [
  // Most of these classify as adverbs, a few as verbs because the gloss begins with 'to ' or
  // due to commas splitting the lemma into four parts like verbs
  'cui',
  'egō[ego]',
  'hic, haec, hoc',
  'ille, illa, illud',
  'ipse, ipsa, ipsum',
  'mē',
  'mihi',
  'nēmō (nūllīus, nēminī, nēminem, nūllō)',
  'nihil[nīl] <INDECL>',
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

const listToObject = (list, group) => list.reduce((obj, word) => ({ ...obj, [word]: group }), {});

module.exports = {
  ...uniqueWords,
  ...listToObject(adjectives, 'Adjective'),
  ...listToObject(conjunctions, 'Conjunction'),
  ...listToObject(pronouns, 'Pronoun'),
};
