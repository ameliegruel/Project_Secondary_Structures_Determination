// fonction globale
const getSecondaryStructure = (structure) => {
    let carbons = getAlphaCarbons(structure);
    console.log(carbons);
    let chains = splitAtomsIntoChains(carbons);
    console.log(chains);
    let chainA = chains["A"];
    let distMatrix = chainA.reduce();

    return [];
};

// récupère les atomes Ca
const getAlphaCarbons = (structure) => {
    return structure.atoms.filter(atom => atom.name === "CA");
};

// sépare les pdb en chaines 
const splitAtomsIntoChains = (atomList) => {
    return atomList.reduce((chains, atom) => {
        if (chains[atom.chainID] === undefined) {
            chains[atom.chainID] = [];
        }
        chains[(atom.chainID)].push(atom);
        return chains;
    }, {})
};

// obtenir la distance euclidienne entre les atomes en 3D
const distanceBetweenAtoms = (atomA, atomB) => {
    return Math.sqrt(
        Math.pow(atomA.x - atomB.x, 2) +
        Math.pow(atomA.y - atomB.y, 2) +
        Math.pow(atomA.z - atomB.z, 2))
};

const lambda = (ssType) => {
    return ssType === "alpha" ? (distanceK) => {
        return distanceK === 2 ? 5.45 : distanceK === 3 ? 5.18 : distanceK === 4 ? 6.37 : new Error("Undefined distance k");
    } : ssType === "beta" ? (distanceK) => {
        return distanceK === 2 ? 6.1 : distanceK === 3 ? 10.4 : distanceK === 4 ? 13 : new Error("Undefined distance k");
    } : new Error("Undefined ssType");
};

const delta = (ssType) => {
    return ssType === "alpha" ? 2.1 : ssType === "beta" ? 1.42 : new Error("Undefined ssType");
};
