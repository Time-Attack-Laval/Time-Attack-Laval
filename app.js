// Si la page n'a pas de tableau, on arrête
if (!document.querySelector("#timesTable")) {
    throw new Error("Pas de tableau sur cette page");
}

const data = TIMES_DATA;
const table = document.querySelector("#timesTable tbody");
const select = document.getElementById("categoryFilter");

// Détection du mode : Si la variable IS_CIRCUIT est définie dans le HTML, on est en mode "Tour"
const isCircuitMode = (typeof IS_CIRCUIT !== 'undefined' && IS_CIRCUIT === true);

// Convertit le temps en secondes pour les calculs
const toSeconds = t => {
  if (!t || t === "" || t === "---") return Infinity;
  if (typeof t === 'number') return t; // Sécurité
  if (!t.includes(":")) return parseFloat(t);
  const [m, s] = t.split(":");
  return parseInt(m) * 60 + parseFloat(s);
};

const formatInfo = info => (info === "" || info === undefined || info === null) ? "---" : info;

function renderTable(dataToDisplay) {
  table.innerHTML = "";

  // 1. Calcul des meilleurs temps (logique différente selon le mode)
  let bestAller = Infinity, bestRetour = Infinity, bestLap = Infinity;

  if (isCircuitMode) {
      // Mode Circuit : Un seul meilleur temps global
      const times = dataToDisplay.map(e => toSeconds(e.temps));
      bestLap = Math.min(...times);
  } else {
      // Mode Spéciale : Meilleur Aller et Meilleur Retour
      const timesAller = dataToDisplay.map(e => toSeconds(e.tempsAller));
      const timesRetour = dataToDisplay.map(e => toSeconds(e.tempsRetour));
      bestAller = Math.min(...timesAller);
      bestRetour = Math.min(...timesRetour);
  }

  // 2. Création des lignes
  dataToDisplay.forEach(e => {
    const row = document.createElement("tr");

    // Colonnes communes (Pilote -> Masse)
    let htmlStart = `
      <td style="font-weight: bold;">${formatInfo(e.pilote)}</td>
      <td style="font-weight: bold;">${formatInfo(e.vehicule)}</td>
      <td style="font-weight: bold;">${formatInfo(e.puissance)}</td>
      <td style="font-weight: bold;">${formatInfo(e.masse)}</td>
    `;

    // Colonnes Temps (Différent selon le mode)
    let htmlTimes = "";
    
    if (isCircuitMode) {
        // --- MODE CIRCUIT (1 seule colonne) ---
        const sec = toSeconds(e.temps);
        let color = "#00ff00"; // Vert par défaut
        if (sec === Infinity) color = "#ffffff";
        else if (sec === bestLap) color = "#bb86fc"; // Violet pour le record

        htmlTimes = `<td style="font-weight: bold; color: ${color};">${formatInfo(e.temps)}</td>`;
    
    } else {
        // --- MODE SPECIALE (Aller + Retour) ---
        const secAller = toSeconds(e.tempsAller);
        const secRetour = toSeconds(e.tempsRetour);

        let colorAller = (secAller === bestAller && secAller !== Infinity) ? "#bb86fc" : (secAller === Infinity ? "#ffffff" : "#00ff00");
        let colorRetour = (secRetour === bestRetour && secRetour !== Infinity) ? "#bb86fc" : (secRetour === Infinity ? "#ffffff" : "#00ff00");

        htmlTimes = `
            <td style="font-weight: bold; color: ${colorAller};">${formatInfo(e.tempsAller)}</td>
            <td style="font-weight: bold; color: ${colorRetour};">${formatInfo(e.tempsRetour)}</td>
        `;
    }

    // Colonnes communes fin (Météo -> Date)
    let htmlEnd = `
      <td style="font-weight: bold;">${formatInfo(e.meteo)}</td>
      <td style="font-weight: bold;">${formatInfo(e.date)}</td>
    `;

    row.innerHTML = htmlStart + htmlTimes + htmlEnd;
    table.appendChild(row);
  });
}

// 3. Génération du menu de filtre
if (isCircuitMode) {
    // Menu simplifié pour le circuit ZI
    select.innerHTML = `
      <option value="temps">Trier par : Meilleur Temps</option>
      <option value="puissance">Trier par : Puissance (Max → Min)</option>
      <option value="masse">Trier par : Masse (Légère → Lourde)</option>
      <option value="date">Trier par : Date (Récent → Ancien)</option>
    `;
    // Tri par défaut pour ZI : Temps
    data.sort((a, b) => toSeconds(a.temps) - toSeconds(b.temps));

} else {
    // Menu complet pour la spéciale (Aller/Retour)
    select.innerHTML = `
      <option value="aller">Trier par : Temps Aller</option>
      <option value="retour">Trier par : Temps Retour</option>
      <option value="puissance">Trier par : Puissance (Max → Min)</option>
      <option value="masse">Trier par : Masse (Légère → Lourde)</option>
      <option value="date">Trier par : Date (Récent → Ancien)</option>
    `;
    // Tri par défaut pour Spéciale : Aller
    data.sort((a, b) => toSeconds(a.tempsAller) - toSeconds(b.tempsAller));
}

renderTable(data);

// 4. Gestionnaire d'événement pour le tri
select.addEventListener("change", () => {
  const critere = select.value;
  let sortedData = [...data];

  switch (critere) {
    // Tri spécifique ZI
    case "temps":
      sortedData.sort((a, b) => toSeconds(a.temps) - toSeconds(b.temps));
      break;

    // Tris spécifiques Spéciale
    case "aller":
      sortedData.sort((a, b) => toSeconds(a.tempsAller) - toSeconds(b.tempsAller));
      break;
    case "retour":
      sortedData.sort((a, b) => toSeconds(a.tempsRetour) - toSeconds(b.tempsRetour));
      break;

    // Tris communs
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