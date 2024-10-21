import React, { useEffect, useState } from 'react';
import "./Componente.css";

const Morty = () => {

const [characters, setcharacters] = useState([]);

useEffect(() => {
  fetch("https://rickandmortyapi.com/api/character")
  .then((response)=>{
    if (!response.ok) {throw new Error(`No se ha encontrado ${response.status}`);}
    else{return response.json();}})

  .then((data)=> {
    console.log(data);
    setcharacters(data.results);
  })

  .catch((error)=>{
    console.error("Error encontrado",error);
  })
},[])



return (
  <div className="container">
    {characters && (
      <div className="characters-section">
        <h1 className="title">Acabamos</h1>
        <div className="characters-grid">
          {characters.map(characterItem => (
            <div key={characterItem.id} className="character-card">
              <h2 className="character-name">Nombre del Personaje: {characterItem.name}</h2>
              <p className="character-info">
                Género: {characterItem.gender} | Ubicación: {characterItem.location.name}
              </p>
              <img
                src={characterItem.image}
                alt={characterItem.name}
                className="character-image"
              />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);


}
export default Morty;
