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
        let comparable = Object.keys(second_struct).reduce((html, chainName) => {
            html += `> Chain${chainName}\n`;
            html += second_struct[chainName].reduce((html, residue, idx) => {
                html += residue.ss;
                if ((idx + 1) % 60 === 0) {
                    html += "\n"
                }
                return html;
            }, "") + "\n";
            return html;
        }, "");

        let pretty = Object.keys(second_struct).reduce((html, chainName) => {
            html += `> Chain${chainName}\n`;
            html += buildHTMLFromChain(second_struct[chainName]);
            return html;
        }, "");

        $("#display").html(`<pre>${comparable}</pre><br><br><pre>${pretty}</pre>`);
    };
    reader.readAsText(f);
};

const getColoredResidueCode = residue => {
    return `<span style="color: ${residue.ss === "H" ? "red" : residue.ss === "E" ? "blue" : residue.ss === "T" ? "green" : "black"}; ">${IUPAC.threeToOne(residue.resName)}</span>`
};


const buildHTMLFromChain = sequence => {
    let html = sequence.reduce((html, residue, idx) => {
        html.seq += getColoredResidueCode(residue);
        html.ss += residue.ss;
        if ((idx + 1) % 50 === 0) {
            html.final += `${html.seq}<br>${html.ss}<br><span class="br"></span>`;
            html.seq = "";
            html.ss = "";
        } else if ((idx + 1) % 10 === 0) {
            html.seq += " ";
            html.ss += " ";
        }
        return html;
    }, {"seq": "", "ss": "", "final": ""});
    return html.final + `${html.seq}<br>${html.ss}<br><span class="br"></span>`;
};

$('#pdb').on("change", getContents);
