/*
SHAPE OF THE OBJECT THAT MUST BE RETURNED
export type AdjectiveProperties = {
  masculineGenitive?: string,
  feminine?: string;
  neuter?: string;
  genitive?: string;
  suffixes: string;
};

SIMPLE EASY MASC, FEM, NEUTER + GEN (IF NEEDED)
duo, duae, duo
hic, haec, hoc
īdem, eadem, idem
ille, illa, illud
ipse, ipsa, ipsum
is, ea, id
iste, ista, istud
quīcumque, quaecumque, quodcumque
uterque, utraque, utrumque

SUBSTANTIVE AND ADJECTIVE FORMS DIFFER
quīdam, quaedam, quiddam (subst., quoddam, adj.)
quīlibet, quaelibet, quidlibet (subst., quodlibet, adj.)
quisque, quaeque, quidque (subst., quodque, adj.)

MASC/FEM THEN NEUTER
quisquam, quidquam/quicquam
trēs, tria
quisnam, quidnam
quisquis, quidquid/quicquid (subst., quodquod, adj.)

nēmō (nūllīus, nēminī, nēminem, nūllō) -> gen. nūllīus, what to do with other cases?
quī, quis -> two different forms: quī quae quod // quis quid -> share genitive cuius and most forms
*/

module.exports = (lemma) => {
  // TODO: genitive
  const commaSplit = lemma.split(', ');
  if (commaSplit.length === 3) {
    const [, feminine, neuter] = commaSplit;
    // STRETCH: improve this 'suffixes' thing;
    return { feminine, neuter, suffixes: '3rd (-er/-ris/-re)' };
  }
  return undefined;
};
