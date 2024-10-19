import React, { useState, useRef } from 'react';
import "./Contador.css"; // Importar los estilos CSS

const TodoList = () => {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [editando, setEditando] = useState(null);
  const [tareaEditada, setTareaEditada] = useState('');
  const inputEditRef = useRef(null);

  const handleAgregarTarea = () => {
    if (nuevaTarea.trim() === '') return;
    setTareas([...tareas, { id: Date.now(), texto: nuevaTarea }]);
    setNuevaTarea('');
  };

  const handleEliminarTarea = (id) => {
    setTareas(tareas.filter(tarea => tarea.id !== id));
  };

  const handleEditarTarea = (id, texto) => {
    setEditando(id);
    setTareaEditada(texto);
    setTimeout(() => inputEditRef.current?.focus(), 100);
  };

  const handleConfirmarEdicion = (id) => {
    setTareas(tareas.map(tarea => tarea.id === id ? { ...tarea, texto: tareaEditada } : tarea));
    setEditando(null);
    setTareaEditada('');
  };

  return (
    <div className="container">
      <h2>Lista de Tareas</h2>
      <input
        type="text"
        placeholder="Añadir tarea"
        value={nuevaTarea}
        onChange={(e) => setNuevaTarea(e.target.value)}
      />
      <button onClick={handleAgregarTarea}>Añadir Tarea</button>

      <ul>
        {tareas.map((tarea) => (
          <li key={tarea.id}>
            {editando === tarea.id ? (
              <div>
                <input
                  ref={inputEditRef}
                  className="edit"
                  type="text"
                  value={tareaEditada}
                  onChange={(e) => setTareaEditada(e.target.value)}
                />
                <button onClick={() => handleConfirmarEdicion(tarea.id)}>Guardar</button>
              </div>
            ) : (
              <div>
                <span>{tarea.texto}</span>
                <button className="editar" onClick={() => handleEditarTarea(tarea.id, tarea.texto)}>Editar</button>
                <button className="eliminar" onClick={() => handleEliminarTarea(tarea.id)}>Eliminar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
