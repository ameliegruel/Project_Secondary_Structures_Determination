/*
* Secondary structures determination based on TM-align algoritm
* 6/11/2019
* Pierre-Valerien Abate de Filippis - Amelie Gruel - Eliot Ragueneau
*/

// function range et getFASTA
const range = (start, stop, step=1) => {
    let arr = [];
    for (let i=start;i<stop;i+=step) {
        arr.push(i);
    }
    return arr;
}

const getFASTA = (aa) => {
    let one_letter = {
        'VAL':'V', 
        'ILE':'I', 
        'LEU':'L', 
        'GLU':'E', 
        'GLN':'Q',
        'ASP':'D', 
        'ASN':'N', 
        'HIS':'H', 
        'TRP':'W', 
        'PHE':'F', 
        'TYR':'Y',    
        'ARG':'R', 
        'LYS':'K', 
        'SER':'S', 
        'THR':'T', 
        'MET':'M', 
        'ALA':'A',    
        'GLY':'G', 
        'PRO':'P', 
        'CYS':'C'
    };
    return one_letter[aa];
}

// fonction globale
const getSecondaryStructure = (structure) => {
    let carbons = getAlphaCarbons(structure);
    let chains = splitAtomsIntoChains(carbons);
    let chainA = chains["A"];
    let SecondaryStructures = chainA.reduce( (accu, Ca, idx) => {
        let test = "alpha";
        if (idx < 2 || (idx > chainA.length-3)) {
            accu.push("-")
        } else {
            for (let j of range(idx-2,idx)) {
                for (let k of range(2,4)) {
                    if ( Math.abs(distanceBetweenAtoms(chainA[j],chainA[j+k]) - lambda[test][k]) >= delta[test] && test === "alpha") {
                        test = "beta";
                        j = idx-2;
                        k = 2;
                    } else if ( Math.abs(distanceBetweenAtoms(chainA[j],chainA[j+k]) - lambda[test][k]) >= delta[test] && test === "beta") {
                        test="coil";
                    }
                }
            }
            if (test === "alpha") {
                accu.push("H");
            } else if (test === "beta") {
                accu.push("B");
            } else if (test === "coil") {
                accu.push("C");
            }
        }
        return accu;
    },
    []);

    return {SS: SecondaryStructures, chain: chainA.reduce( (accu,Ca) => {
        accu.push(getFASTA(Ca.resName));
        return accu;
    },
    [])};
};

// récupère les atomes Ca
const getAlphaCarbons = (structure) => (structure.atoms.filter(atom => atom.name === "CA"));

// sépare les pdb en chaines 
const splitAtomsIntoChains = (atomList) => atomList.reduce((chains, atom) => {
    if (!chains[atom.chainID]) {chains[atom.chainID] = []}
    chains[atom.chainID].push(atom);
    return chains;
}, {});

// obtenir la distance euclidienne entre les atomes en 3D
const distanceBetweenAtoms = (atomA, atomB) => ( Math.sqrt(Math.pow(atomA.x - atomB.x, 2) + Math.pow(atomA.y - atomB.y, 2) + Math.pow(atomA.z - atomB.z, 2)) );

// obtenir les constantes lambda et delta
const lambda = {alpha: {2: 5.45, 3: 5.18, 4: 6.37}, beta: {2: 6.1, 3: 10.4, 4: 13}};

const delta = {alpha: 2.1, beta: 1.42};