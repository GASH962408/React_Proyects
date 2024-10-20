import React, { useState, useRef, useEffect } from 'react';
import './TodoList.css';


const TodoList = () => {
  const [tareas, setTareas] = useState([]);
  const [modoOscuro, setModoOscuro] = useState(true);
  const [input, setInput] = useState("")
  const [tarea, setTarea] = useState(null);

  useEffect(() => {
      document.body.className = modoOscuro? "oscuro":"claro";
  }, [modoOscuro])

  const add = () => {
    if (input.trim() !== "" ) {
      setTareas([...tareas,{text:tarea,completed:false}]);
      setInput("");
    }}

  const done = (id) => {
    setTareas(tareas.map(tarea => tarea.id==id ? {...tarea,completed:true}:tarea   ))
    };

    const delete=(id) =>{
      setTareas(tareas.filter(tarea => tarea.id!==id))
    }

    )

    const handleEliminarTarea = (id) => {
      setTareas(tareas.filter(tarea => tarea.id !== id));
    };

  return(
    <div>
      <input type="text"
      value={input}
      onChange={(e)=>setTarea(e.target.value)} />
    </div>
  )


}
export default TodoList;
