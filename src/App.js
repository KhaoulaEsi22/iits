import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = "https://api.sheetbest.com/sheets/1aca05ed-d6f2-460f-802f-15b0f00ee099";

function App() {
  const [prospects, setProspects] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState('');

  // Charger les données depuis Google Sheet
  useEffect(() => {
    if (authorized) {
      axios.get(API_URL)
        .then(res => setProspects(res.data))
        .catch(err => console.error("Erreur de chargement :", err));
    }
  }, [authorized]);

  // Copier le message personnalisé
  const handleCopy = (message) => {
    navigator.clipboard.writeText(message);
    alert("📋 Message copié !");
  };

  // Marquer comme envoyé (mettre à jour la feuille)
  const handleStatusUpdate = (prospect) => {
    // ATTENTION : La mise à jour doit cibler une URL ou un endpoint qui identifie la ligne
    // Exemple (à adapter selon l'API Sheetbest) :
    // axios.patch(`${API_URL}/rows/{id}`, { Statut: "Envoyé ✅" })

    axios.patch(API_URL, {
      "LinkedIn": prospect.LinkedIn, // Clé pour identifier la ligne (vérifie si c’est correct avec ton API)
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

  if (!authorized) {
    return (
      <div className="container">
        <h2>🔐 Accès privé</h2>
        <input
          type="password"
          placeholder="Mot de passe"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={() => {
          if (input === "monmotdepasse") setAuthorized(true);
          else alert("Mot de passe incorrect");
        }}>
          Accéder
        </button>
      </div>
    );
  }

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
