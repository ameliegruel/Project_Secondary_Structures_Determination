// fonction globale
const getSecondaryStructure = (structure) => {
    let carbons = getAlphaCarbons(structure);
    console.log(carbons);
    let chains = splitAtomsIntoChains(carbons);
    console.log(chains);
    let chainA = chains["A"];
    let distMatrix = chainA.reduce();

    return [].reduce();
};

// récupère les atomes Ca
const getAlphaCarbons = (structure) => structure.atoms.filter(atom => atom.name === "CA");

// sépare les pdb en chaines 
const splitAtomsIntoChains = (atomList) => atomList.reduce((chains, atom) => {
    chains[atom.chainID] = chains[atom.chainID] ? chains[atom.chainID] : [atom];
    chains[atom.chainID].push(atom);
    return chains;
}, {});


// obtenir la distance euclidienne entre les atomes en 3D
const distanceBetweenAtoms = (atomA, atomB) => Math.sqrt(Math.pow(atomA.x - atomB.x, 2) + Math.pow(atomA.y - atomB.y, 2) + Math.pow(atomA.z - atomB.z, 2));

const lambda = {alpha: {2: 5.45, 3: 5.18, 4: 6.37}, beta: {2: 6.1, 3: 10.4, 4: 13}};

const delta = {alpha: 2.1, beta: 1.42};
