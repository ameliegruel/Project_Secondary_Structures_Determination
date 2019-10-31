/*
* Load Local PDB file
* 6/11/2019
* Pierre-Valerien Abate de Filippis - Amelie Gruel - Eliot Ragueneau
*/


const getContents = (event) => {
    let f = event.target.files[0];

    let reader = new FileReader();
    reader.onload = () => {
        let text = reader.result;
        let struct = parsePDB(text);
        console.time("Secondary Structure");
        let second_struct = getSecondaryStructure(struct);
        console.timeEnd("Secondary Structure");
        let html = Object.keys(second_struct).reduce((html, chainName) => {
            html += `Chain ${chainName} :\n`;
            html += buildHTMLFromSequence(second_struct[chainName]);
            return html;
        }, "");

        $("#display").html(`<pre>${html}</pre>`);
    };
    reader.readAsText(f);
};

const getColoredResidueCode = residue => {
    return `<span style="color: ${residue.ss === "H" ? "red" : residue.ss === "E" ? "blue" : residue.ss === "T" ? "green" : "black"}; ">${IUPAC.threeToOne(residue.resName)}</span>`
};

const buildHTMLFromSequence = (sequence) => {
  let html = "";
  let ssLine = "";
  for (let residue of sequence) {
    html += getColoredResidueCode(residue);
    ssLine += residue.ss;
    if (residue.resSeq % 50 === 0) {
      html += `<br>${ssLine}<br><span class="br"></span>`;
      ssLine = "";
    } else if (residue.resSeq % 10 === 0) {
      html += " ";
      ssLine += " ";
    }
  }
  return `${html}<br>${ssLine}<br><br><br>`;
};

$('#pdb').on("change", getContents);
console.log("test");