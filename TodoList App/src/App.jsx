
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("todos")) || [];
    } catch {
      return [];
    }
  });

  const [editId, setEditId] = useState(null);
  const [showFinished, setShowFinished] = useState(true);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    if (todo.trim() === "") return;

    if (editId !== null) {
      setTodos((prevTodos) =>
        prevTodos.map((item) =>
          item.id === editId
            ? { ...item, todo: todo.trim() }
            : item
        )
      );
      setEditId(null);
    } else {
      setTodos((prevTodos) => [
        ...prevTodos,
        {
          id: uuidv4(),
          todo: todo.trim(),
          isCompleted: false,
        },
      ]);
    }

    setTodo("");
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((item) =>
        item.id === id
          ? { ...item, isCompleted: !item.isCompleted }
          : item
      )
    );
  };

  const handleEdit = (id) => {
    const selectedTodo = todos.find((item) => item.id === id);

    if (selectedTodo) {
      setTodo(selectedTodo.todo);
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    setTodos((prevTodos) =>
      prevTodos.filter((item) => item.id !== id)
    );

    if (editId === id) {
      setEditId(null);
      setTodo("");
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setTodo("");
  };

  return (
    <>
      <Navbar />

      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-1/2">
      <h1 className="font-bold text-center text-xl">iTask - Manage Your Tasks</h1>
        <div className="addtod my-5">
          <h2 className="text-lg font-bold">
            {editId !== null ? "Edit Todo" : "Add Todo"}
          </h2>

          <input
            onChange={handleChange}
            value={todo}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            type="text"
            placeholder="Enter your todo..."
            className="w-full sm:w-1/2 bg-white border border-black rounded-md p-2"
          />

          <button
            onClick={handleAdd}
            className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-3"
          >
            {editId !== null ? "Update" : "Add"}
          </button>

          {editId !== null && (
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-700 p-2 py-1 text-sm font-bold text-white rounded-md"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 my-5">
          <input
            id="showFinished"
            type="checkbox"
            checked={showFinished}
            onChange={() => setShowFinished(!showFinished)}
          />
          <label htmlFor="showFinished" className="cursor-pointer">
            Show 
          </label>
        </div>

        <h2 className="text-lg font-bold">Your Todos</h2>

        <div className="todos w-full sm:w-1/2">
          {todos.filter((item) => showFinished || !item.isCompleted).length ===
            0 && (
            <p className="my-3 text-gray-600">
              No todos to display!
            </p>
          )}

          {todos
            .filter((item) => showFinished || !item.isCompleted)
            .map((item) => (
              <div
                key={item.id}
                className="todo flex items-start gap-3 my-4 md:w-full"
              >
                <input
                  name={item.id}
                  onChange={() => handleCheckbox(item.id)}
                  type="checkbox"
                  checked={item.isCompleted}
                  className="shrink-0 mt-1"
                />

                <div
                  className="flex-1 min-w-0 whitespace-normal [overflow-wrap:anywhere]"
                  style={{
                    textDecoration: item.isCompleted
                      ? "line-through"
                      : "none",
                  }}
                >
                  {item.todo}
                </div>

                <div className="buttons flex shrink-0 gap-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-violet-800 hover:bg-violet-950 px-3 py-2 text-sm font-bold text-white rounded-md"
                  >
                   <FaEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-violet-800 hover:bg-violet-950 px-3 py-2 text-sm font-bold text-white rounded-md"
                  >
                   <MdDelete />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default App;