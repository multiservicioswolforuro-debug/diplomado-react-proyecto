import { useEffect, useState } from "react";
import { axiosClient } from "../../lib/axiosCliente";

interface Task {
  id: number;
  name: string;
  done: boolean;
}

export const TaskPage = () => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // OBTENER TAREAS
  const getTasks = async () => {

    try {

      const response = await axiosClient.get("/tasks");

      console.log(response.data);

      if (Array.isArray(response.data.data)) {

        setTasks(response.data.data);

      } else {

        setTasks([]);

      }

    } catch (error) {

      console.log(error);

      setTasks([]);

    }
  };

  // CREAR
  const createTask = async () => {

    if (!title.trim()) return;

    try {

      await axiosClient.post("/tasks", {
        name: title,
      });

      setTitle("");

      getTasks();

    } catch (error) {

      console.log(error);

    }
  };

  // ELIMINAR
  const deleteTask = async (id: number) => {

    try {

      await axiosClient.delete(`/tasks/${id}`);

      getTasks();

    } catch (error) {

      console.log(error);

    }
  };

  // CAMBIAR ESTADO
  const toggleTask = async (id: number, done: boolean) => {

    try {

      await axiosClient.patch(`/tasks/${id}`, {
        done: !done,
      });

      getTasks();

    } catch (error) {

      console.log(error);

    }
  };

  // EDITAR
  const updateTask = async (id: number) => {

    try {

      await axiosClient.put(`/tasks/${id}`, {
        name: title,
      });

      setEditingId(null);

      setTitle("");

      getTasks();

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    getTasks();

  }, []);

  return (

    <div
      style={{
        padding: "30px",
        maxWidth: "900px",
      }}
    >

      <h1
        style={{
          marginBottom: "25px",
          fontSize: "42px",
          fontWeight: "bold",
        }}
      >
        Gestión de Tareas
      </h1>

      {/* FORMULARIO */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
        }}
      >

        <input
          type="text"
          placeholder="Nueva tarea"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: "12px",
            width: "350px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        {
          editingId ? (

            <button
              onClick={() => updateTask(editingId)}
              style={{
                padding: "12px 20px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#ff9800",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Actualizar
            </button>

          ) : (

            <button
              onClick={createTask}
              style={{
                padding: "12px 20px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#2196f3",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Crear
            </button>

          )
        }

      </div>

      {/* LISTA */}
      {
        !tasks || tasks.length === 0 ? (

          <p
            style={{
              fontSize: "18px",
              color: "gray",
            }}
          >
            No hay tareas registradas
          </p>

        ) : (

          tasks.map((task) => (

            <div
              key={task.id}
              style={{
                border: "1px solid #ddd",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "12px",
                backgroundColor: "#fff",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
              }}
            >

              <h3
                style={{
                  textDecoration:
                    task.done
                      ? "line-through"
                      : "none",

                  color:
                    task.done
                      ? "gray"
                      : "black",

                  marginBottom: "15px",

                  fontSize: "24px",
                }}
              >
                {task.name}
              </h3>

              {/* CHECKBOX MODERNO */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                  fontWeight: "bold",
                  border: "1px solid #ddd",
                  width: "fit-content",
                  marginBottom: "15px",
                }}
              >

                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id, task.done)}
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                    accentColor: "#4caf50",
                  }}
                />

                {
                  task.done
                    ? "✅ Finalizada"
                    : "⏳ Pendiente"
                }

              </label>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >

                <button
                  onClick={() => {
                    setEditingId(task.id);
                    setTitle(task.name);
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#ff9800",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Editar
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#f44336",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Eliminar
                </button>

              </div>

            </div>

          ))
        )
      }

    </div>
  );
};