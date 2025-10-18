import React, { useState, useEffect } from "react";

const TodoListPage = () => {
  const API_USER = "https://playground.4geeks.com/todo/users/alesanchezr";
  const API_TODOS = "https://playground.4geeks.com/todo/todos/alesanchezr";

  const [listItems, setListItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const res = await fetch(API_USER, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([]), // array vacío obligatorio
        });

        if (res.status === 400) {
          // Usuario ya existe → ignoramos
          console.log("Usuario ya existe, continuando...");
        }

        setListItems([]);
      } catch (err) {
        console.error("Error inicializando usuario:", err);
      }
    };

    initializeUser();
  }, []);

  // Crear nueva tarea usando POST
  const createItem = (taskLabel) => {
    if (!taskLabel.trim()) return;

    const task = { label: taskLabel, done: false };

    fetch(API_TODOS, {
      method: "POST",
      body: JSON.stringify(task),
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => {
        if (!resp.ok) throw new Error("Error al agregar tarea");
        return resp.json();
      })
      .then((data) => {
        console.log("Tarea agregada:", data);
        setListItems([...listItems, task]); // actualiza estado local
        setInputValue("");
      })
      .catch((error) => console.log(error));
  };

  // Borrar tarea localmente y actualizar toda la lista con PUT
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