const data = TIMES_DATA;
const table = document.querySelector("#timesTable tbody");

// Convertit le temps en secondes, renvoie Infinity si vide ou invalide pour le tri
const toSeconds = t => {
  if (!t || t === "" || t === "---") return Infinity;
  if (!t.includes(":")) return parseFloat(t);
  const [m, s] = t.split(":");
  return parseInt(m) * 60 + parseFloat(s);
};

function renderTable(dataToDisplay) {
  table.innerHTML = "";

  // 1. On trouve les meilleurs temps (en ignorant Infinity)
  const timesAller = dataToDisplay.map(e => toSeconds(e.tempsAller));
  const timesRetour = dataToDisplay.map(e => toSeconds(e.tempsRetour));
  
  const bestAller = Math.min(...timesAller);
  const bestRetour = Math.min(...timesRetour);

  dataToDisplay.forEach(e => {
    const row = document.createElement("tr");
    
    const secAller = toSeconds(e.tempsAller);
    const secRetour = toSeconds(e.tempsRetour);

    // 2. Choix de la couleur : Violet si record, Vert si temps normal, Blanc si pas de temps
    let colorAller = "#00ff00"; 
    if (secAller === Infinity) colorAller = "#ffffff";
    else if (secAller === bestAller) colorAller = "#bb86fc";

    let colorRetour = "#00ff00";
    if (secRetour === Infinity) colorRetour = "#ffffff";
    else if (secRetour === bestRetour) colorRetour = "#bb86fc";

    row.innerHTML = `
      <td>${e.pilote}</td>
      <td>${e.vehicule}</td>
      <td>${e.puissance}</td>
      <td>${e.masse}</td>
      <td style="font-weight: bold; color: ${colorAller};">${e.tempsAller || "---"}</td>
      <td style="font-weight: bold; color: ${colorRetour};">${e.tempsRetour || "---"}</td>
      <td>${e.meteo}</td>
      <td>${e.date}</td>
    `;
    table.appendChild(row);
  });
}

// Tri par défaut
data.sort((a, b) => toSeconds(a.tempsAller) - toSeconds(b.tempsAller));
renderTable(data);

// Menu de tri
const select = document.getElementById("categoryFilter");
select.innerHTML = `
  <option value="aller">Trier par : Temps Aller</option>
  <option value="retour">Trier par : Temps Retour</option>
  <option value="puissance">Trier par : Puissance (Max → Min)</option>
  <option value="masse">Trier par : Masse (Légère → Lourde)</option>
  <option value="date">Trier par : Date (Récent → Ancien)</option>
`;

select.addEventListener("change", () => {
  const critere = select.value;
  let sortedData = [...data];

  switch (critere) {
    case "aller":
      sortedData.sort((a, b) => toSeconds(a.tempsAller) - toSeconds(b.tempsAller));
      break;
    case "retour":
      sortedData.sort((a, b) => toSeconds(a.tempsRetour) - toSeconds(b.tempsRetour));
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