const data = TIMES_DATA;

function getCategory(ratio) {
  ratio = parseFloat(ratio);
  if (ratio < 4) return "GT1";
  if (ratio < 7.5) return "GT2";
  if (ratio < 10) return "GT3";
  if (ratio < 13.5) return "GT4";
  if (ratio < 17) return "GT5";
  return "GT6";
}

data.forEach(e => {
  const r = e.masse / e.puissance;
  e.ratioNum = r; 
  e.ratioDisp = r.toFixed(1); 
  e.category = getCategory(r);
});

const table = document.querySelector("#timesTable tbody");

// Fonction d'affichage propre
function renderTable(dataToDisplay) {
  table.innerHTML = "";
  dataToDisplay.forEach(e => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${e.pilote}</td>
      <td>${e.vehicule}</td>
      <td>${e.puissance}</td>
      <td>${e.masse}</td>
      <td>${e.category} - ratio (${e.ratioDisp.replace('.', ',')} kg/ch)</td>
      <td>${e.temps}</td>
      <td>${e.meteo}</td>
      <td>${e.date}</td>
    `;
    table.appendChild(row);
  });
}

// Utilitaire pour convertir "MM:SS.ms" en secondes totales
const toSeconds = t => {
  const [m, s] = t.split(":");
  return parseInt(m) * 60 + parseFloat(s);
};

// Affichage initial : Trié par temps par défaut
data.sort((a, b) => toSeconds(a.temps) - toSeconds(b.temps));
renderTable(data);

// Gestion dynamique du menu de tri
const select = document.getElementById("categoryFilter");
select.innerHTML = `
  <option value="temps">Trier par : Temps (Le plus rapide)</option>
  <option value="category">Trier par : Catégorie (GT1 → GT6)</option>
  <option value="ratio">Trier par : Ratio (Performance)</option>
  <option value="puissance">Trier par : Puissance (Max → Min)</option>
  <option value="masse">Trier par : Masse (Légère → Lourde)</option>
  <option value="date">Trier par : Date (Récent → Ancien)</option>
`;

select.addEventListener("change", () => {
  const critere = select.value;
  let sortedData = [...data];

  switch (critere) {
    case "temps":
      sortedData.sort((a, b) => toSeconds(a.temps) - toSeconds(b.temps));
      break;
    case "category":
      // Trie par nom de catégorie (GT1, GT2...)
      sortedData.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case "ratio":
      sortedData.sort((a, b) => a.ratioNum - b.ratioNum);
      break;
    case "puissance":
      sortedData.sort((a, b) => b.puissance - a.puissance);
      break;
    case "masse":
      sortedData.sort((a, b) => a.masse - b.masse);
      break;
    case "date":
      sortedData.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
  }

  renderTable(sortedData);
});