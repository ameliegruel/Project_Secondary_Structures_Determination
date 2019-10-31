/*
* Load Local PDB file
* 6/11/2019
* Pierre-Valerien Abate de Filippis - Amelie Gruel - Eliot Ragueneau
*/

const getContents = (event) => {
  let f = event.target.files[0];

  let reader = new FileReader();
  reader.onload = ev => {
    let text = reader.result;
    let struct = parsePDB(text);
    console.log(struct);
    let second_struct = getSecondaryStructure(struct);
    console.log(second_struct);
    
    let d = document.querySelector('#display');
      const html = (obj) => {
        let html="";
        html+=`chain               : ${obj.chain.join("")}\nsecondary structure : ${obj.SS.join("")}\n\n`;
        return `<pre>${html}<\pre>`;
      };
    d.innerHTML=html(second_struct);
    };
  reader.readAsText(f);
};

$('#pdb').on("change", getContents);