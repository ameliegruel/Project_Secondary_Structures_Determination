/*
* Secondary structures determination based on TM-align algoritm
* 6/11/2019
* Pierre-Valerien Abate de Filippis - Amelie Gruel - Eliot Ragueneau
*/


// obtenir les constantes lambda et delta
const lambda = {alpha: {2: 5.45, 3: 5.18, 4: 6.37}, beta: {2: 6.1, 3: 10.4, 4: 13}};

const delta = {alpha: 2.1, beta: 1.42};

// fonction globale
const getSecondaryStructure = (structure) => {
    let chains = splitAtomsIntoChains(getAlphaCarbons(structure));
    return Object.keys(chains).reduce((chains, chainName) => {
        let chain = chains[chainName];
        let isResiduePartOfSSType = getResidueCheckerFromChain(chain);
        chain = chain.map((residueCA, idx) => {
            if (idx <= 1 || idx > chain.length - 3) {
                residueCA.ss = " ";
            } else if (isResiduePartOfSSType("alpha", idx)) {
                residueCA.ss = "H";
            } else if (isResiduePartOfSSType("beta", idx)) {
                residueCA.ss = "E";
            } else if (distanceBetweenAtoms(chain[idx - 2], chain[idx + 2]) < 8) {
                residueCA.ss = "T";
            } else {
                residueCA.ss = " ";
            }
            return residueCA;
        });
        return chains;
    }, chains);
};

const getResidueCheckerFromChain = (chain) => (ssType, idx) => {
    for (let j of range(-2, 1)) {
        for (let k of range(2, 3 - j)) {
            if (Math.abs(distanceBetweenAtoms(chain[idx + j], chain[idx + j + k]) - lambda[ssType][k]) >= delta[ssType]) {
                return false;
            }
        }
    }
    return true;
};

// récupère les atomes Ca
const getAlphaCarbons = (structure) => (structure.atoms.filter(atom => atom.name === "CA"));

// sépare les pdb en chaines 
const splitAtomsIntoChains = (atomList) => atomList.reduce((chains, atom) => {
    if (!chains[atom.chainID]) {
        chains[atom.chainID] = []
    }
    chains[atom.chainID].push(atom);
    return chains;
}, {});

// obtenir la distance euclidienne entre les atomes en 3D
const distanceBetweenAtoms = (atomA, atomB) => (Math.sqrt(Math.pow(atomA.x - atomB.x, 2) + Math.pow(atomA.y - atomB.y, 2) + Math.pow(atomA.z - atomB.z, 2)));

// function range et getFASTA
const range = (start, stop, step = 1) => {
    let arr = [];
    for (let i = start; i < stop; i += step) {
        arr.push(i);
    }
    return arr;
};