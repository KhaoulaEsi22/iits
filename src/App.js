import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = "https://api.sheetbest.com/sheets/1aca05ed-d6f2-460f-802f-15b0f00ee099";

function App() {
  const [prospects, setProspects] = useState([]);

  // Charger les données depuis Google Sheet
  useEffect(() => {
    axios.get(API_URL)
      .then(res => setProspects(res.data))
      .catch(err => console.error("Erreur de chargement :", err));
  }, []);

  // Copier le message personnalisé
  const handleCopy = (message) => {
    navigator.clipboard.writeText(message);
    alert("📋 Message copié !");
  };

  // Marquer comme envoyé (met à jour Google Sheet)
  const handleStatusUpdate = (prospect) => {
    axios.patch(API_URL, {
      "LinkedIn": prospect.LinkedIn, // Clé utilisée pour identifier la ligne
      "Statut": "Envoyé ✅"
    })
    .then(() => {
      setProspects(prev =>
        prev.map(p =>
          p.LinkedIn === prospect.LinkedIn ? { ...p, Statut: "Envoyé ✅" } : p
        )
      );
    })
    .catch(err => alert("Erreur de mise à jour :", err));
  };

  return (
    <div className="container">
      <h2>🧠 Dashboard des prospects</h2>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>nom</th>
            <th>Domaine</th>
            <th>Groupe A/B</th>
            <th>Message généré</th>
            <th>Actions</th>
            <th>Statut</th>
            <th>Date de création</th>
          </tr>
        </thead>
        <tbody>
          {prospects.map((p, index) => (
            <tr key={index}>
              <td>{p.nom}</td>
              <td>{p.Domaine}</td>
              <td>{p["Groupe A/B"]}</td>
              <td>
                <pre style={{ whiteSpace: 'pre-wrap', maxWidth: '400px' }}>
                  {p["Message généré"]}
                </pre>
              </td>
              <td>
                <button onClick={() => handleCopy(p["Message généré"])}>📋 Copier</button>
                <button onClick={() => handleStatusUpdate(p)}>✅ Marquer envoyé</button>
              </td>
              <td>{p.Statut || "⏳ En attente"}</td>
              <td>{p["Date de création"] || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
