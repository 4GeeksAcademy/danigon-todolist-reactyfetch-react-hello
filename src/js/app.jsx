import React, { useState, useEffect } from "react";

const API_URL = "https://playground.4geeks.com/todo/users/dani-gones";


const App = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");

// GET TAREA
  const getTasks = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener tareas");
      const data = await res.json();
      setTasks(data.todos || []);
    } catch (err) {
      console.error("❌ Error cargando tareas:", err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

// AGG TAREA
  const addTask = async (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newTask = { label: inputValue, is_done: false };
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        });
        if (!res.ok) throw new Error("Error al agregar tarea");
        setInputValue("");
        getTasks(); // actualiza la lista
      } catch (err) {
        console.error("❌ Error agregando tarea:", err);
      }
    }
  };

  // Eliminar una tarea (DELETE /todos/:user/:id)
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar tarea");
      getTasks();
    } catch (err) {
      console.error("❌ Error eliminando tarea:", err);
    }
  };

  // Limpiar todas las tareas (DELETE /todos/:user)
  const clearAllTasks = async () => {
    try {
      const res = await fetch(API_URL, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al limpiar todas las tareas");
      setTasks([]);
    } catch (err) {
      console.error("❌ Error limpiando todas las tareas:", err);
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
        onKeyDown={addTask}
      />

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.label}</span>
            <button onClick={() => deleteTask(task.id)}>❌</button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && <p>No hay tareas, ¡añade una!</p>}

      <button className="clear-btn" onClick={clearAllTasks}>
        🧹 Limpiar todo
      </button>
    </div>
  );
};

export default App;

