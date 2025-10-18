import React, { useState, useEffect } from "react";

  const TodoListPage = () => {
  const API_USER = "https://playground.4geeks.com/todo/users/dani-gones";
  const API_TODOS = "https://playground.4geeks.com/todo/todos/dani-gones";

  // Estado de tareas e input
  const [listItems, setListItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Inicializar usuario al montar
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const res = await fetch(API_USER, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]), // array vacío obligatorio
        });

        if (res.status === 400) {
          // Usuario ya existe → ignorar
          console.log("Usuario ya existe, continuando...");
        }

        // Inicialmente lista vacía
        setListItems([]);
      } catch (err) {
        console.error("Error inicializando usuario:", err);
      }
    };

    initializeUser();
  }, []);

  // Crear nueva tarea
  const createItem = async (taskLabel) => {
    if (!taskLabel.trim()) return;

    const newTask = { label: taskLabel, done: false };
    const updatedTasks = [...listItems, newTask];

    try {
      await fetch(API_TODOS, {
        method: "PUT", // reemplaza toda la lista
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTasks),
      });

      setListItems(updatedTasks);
      setInputValue("");
    } catch (err) {
      console.error("Error agregando tarea:", err);
    }
  };

  // Borrar tarea
  const deleteItem = async (index) => {
    const updatedTasks = listItems.filter((_, i) => i !== index);

    try {
      await fetch(API_TODOS, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTasks),
      });
      setListItems(updatedTasks);
    } catch (err) {
      console.error("Error eliminando tarea:", err);
    }
  };

  // Limpiar todas las tareas
  const clearAll = async () => {
    try {
      await fetch(API_TODOS, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      });
      setListItems([]);
    } catch (err) {
      console.error("Error limpiando todas las tareas:", err);
    }
  };

  return (
    <div className="app-container">
      <h1>📝 To-Do List</h1>

      <input
        type="text"
        value={inputValue}
        placeholder="Escribe una tarea y presiona Enter"
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && createItem(inputValue)}
      />

      <ul>
        {listItems.map((item, index) => (
          <li key={index}>
            <span>{item.label}</span>
            <button onClick={() => deleteItem(index)}>❌</button>
          </li>
        ))}
      </ul>

      {listItems.length === 0 && <p>No hay tareas, ¡añade una!</p>}

      <button onClick={() => createItem(inputValue)}>➕</button>
      <button onClick={clearAll}>🧹</button>
    </div>
  );
};

export default TodoListPage; 