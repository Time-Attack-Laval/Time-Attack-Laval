const data = TIMES_DATA;
const table = document.querySelector("#timesTable tbody");

// Convertit le temps en secondes, renvoie Infinity si vide pour le tri
const toSeconds = t => {
  if (!t || t === "" || t === "---") return Infinity;
  if (!t.includes(":")) return parseFloat(t);
  const [m, s] = t.split(":");
  return parseInt(m) * 60 + parseFloat(s);
};

// Fonction utilitaire pour gérer le texte vide et le mettre en gras
const formatInfo = info => {
  return (info === "" || info === undefined || info === null) ? "---" : info;
};

function renderTable(dataToDisplay) {
  table.innerHTML = "";

  // Calcul des meilleurs temps
  const timesAller = dataToDisplay.map(e => toSeconds(e.tempsAller));
  const timesRetour = dataToDisplay.map(e => toSeconds(e.tempsRetour));
  const bestAller = Math.min(...timesAller);
  const bestRetour = Math.min(...timesRetour);

  dataToDisplay.forEach(e => {
    const row = document.createElement("tr");
    
    const secAller = toSeconds(e.tempsAller);
    const secRetour = toSeconds(e.tempsRetour);

    // Choix de la couleur pour les chronos
    let colorAller = "#00ff00"; 
    if (secAller === Infinity) colorAller = "#ffffff";
    else if (secAller === bestAller) colorAller = "#bb86fc";

    let colorRetour = "#00ff00";
    if (secRetour === Infinity) colorRetour = "#ffffff";
    else if (secRetour === bestRetour) colorRetour = "#bb86fc";

    // On applique font-weight: bold à chaque cellule <td>
    row.innerHTML = `
      <td style="font-weight: bold;">${formatInfo(e.pilote)}</td>
      <td style="font-weight: bold;">${formatInfo(e.vehicule)}</td>
      <td style="font-weight: bold;">${formatInfo(e.puissance)}</td>
      <td style="font-weight: bold;">${formatInfo(e.masse)}</td>
      <td style="font-weight: bold; color: ${colorAller};">${formatInfo(e.tempsAller)}</td>
      <td style="font-weight: bold; color: ${colorRetour};">${formatInfo(e.tempsRetour)}</td>
      <td style="font-weight: bold;">${formatInfo(e.meteo)}</td>
      <td style="font-weight: bold;">${formatInfo(e.date)}</td>
    `;
    table.appendChild(row);
  });
}

// Tri par défaut
data.sort((a, b) => toSeconds(a.tempsAller) - toSeconds(b.tempsAller));
renderTable(data);

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
      sortedData.sort((a, b) => (b.puissance || 0) - (a.puissance || 0));
      break;
    case "masse":
      sortedData.sort((a, b) => (a.masse || Infinity) - (b.masse || Infinity));
      break;
    case "date":
      sortedData.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      break;
  }
  renderTable(sortedData);
});