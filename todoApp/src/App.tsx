import { useEffect, useState } from "react";
import { FrappeProvider } from "frappe-react-sdk";
import axios from "axios";
import TodoCard from "./TodoCard";

interface Todo {
  name: string;
  description: string;
  status: string;
}

function App() {
  const [description, setDescription] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);

  const api = axios.create({
    baseURL: "http://localhost:8000/api/method",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getTodos = async () => {
    try {
      const res = await api.get("/todo_app.todo_app.api.todo.get_todos");
      const data = res.data.message;
      const inProgress = data.filter((todo: { status: string }) => todo.status !== "completed");
      const completed = data.filter((todo: { status: string }) => todo.status === "completed");
      setTodos(inProgress);
      setCompletedTodos(completed);
    } catch (err) {
      console.log("error fetching todos:", err);
    }
  };

  const addTodo = async () => {
    try {
      await api.post("/todo_app.todo_app.api.todo.create_todo", {
        description,
        status: "in progress",
      });
      setDescription("");
      getTodos();
    } catch (error) {
      console.log("error while adding todo:", error);
    }
  };

  const checkToDo = async (name: string) => {
    try {
      await api.put("/todo_app.todo_app.api.todo.update_todo", { name: name, status: "completed" });
      getTodos();
    } catch (err) {
      console.log("error while checking todo:", err);
    }
  };

  const deleteTodo = async (name: string) => {
    try {
      await api.delete("/todo_app.todo_app.api.todo.delete_todo", { params: { name: name } });
      getTodos();
    } catch (error) {
      console.log("error while deleting todo:", error);
    }
  };

  useEffect(() => {
    getTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <FrappeProvider>
        <div className="w-[60%] h-full rounded-[20px] bg-[#1D1825] flex flex-col items-center justify-center p-[1%] my-[5%]">
          <h1 className="text-white text-3xl mb-[10px] mt-[1%] font-bold">ToDo App</h1>
          <div className="bg-[transparent] flex flex-row items-center space-x-5 w-[75%]">
            <input
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full h-[6%] rounded-[3px] bg-[transparent] border border-[#9E78CF] text-[#B4B4B4] p-2  flex-grow"
              placeholder="Add a new Task"
            />
            <button
              onClick={addTodo}
              className="bg-[#9E78CF] text-white p-2 rounded-md w-[6%] items-center content-center"
            >
              <svg
                width="20"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 12C24 12.2652 23.8946 12.5196 23.7071 12.7071C23.5196 12.8946 23.2652 13 23 13H13V23C13 23.2652 12.8946 23.5196 12.7071 23.7071C12.5196 23.8946 12.2652 24 12 24C11.7348 24 11.4804 23.8946 11.2929 23.7071C11.1054 23.5196 11 23.2652 11 23V13H1C0.734784 13 0.48043 12.8946 0.292893 12.7071C0.105357 12.5196 0 12.2652 0 12C0 11.7348 0.105357 11.4804 0.292893 11.2929C0.48043 11.1054 0.734784 11 1 11H11V1C11 0.734784 11.1054 0.48043 11.2929 0.292893C11.4804 0.105357 11.7348 0 12 0C12.2652 0 12.5196 0.105357 12.7071 0.292893C12.8946 0.48043 13 0.734784 13 1V11H23C23.2652 11 23.5196 11.1054 23.7071 11.2929C23.8946 11.4804 24 11.7348 24 12Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
          <p className="text-[16px] text-[#9E78CF] mt-[7%] mr-[62%]">
            Tasks to do - {todos.length}
          </p>

          {todos.map((todo) => (
            <TodoCard
              key={todo.name}
              todo={todo}
              handleCheck={(name) => checkToDo(name)}
              deleteTodo={(name) => deleteTodo(name)}
            />
          ))}

          <p className="text-[16px] text-[#9E78CF] mt-[7%] mr-[66%]">
            Done - {completedTodos.length}
          </p>
          {completedTodos.map((todo) => (
            <TodoCard
              key={todo.name}
              todo={todo}
              handleCheck={(name) => console.log(name)}
              deleteTodo={(name) => console.log(name)}
            />
          ))}
        </div>
      </FrappeProvider>
    </div>
  );
}

export default App;
