import { useEffect, useState } from "react";
import { PencilLine, Trash2 } from "lucide-react";
import {
    getDatabase,
    onValue,
    push,
    ref,
    remove,
    update
} from "firebase/database";

function ToDoList() {
    const db = getDatabase();
    const [input, setInput] = useState("");
    const [printItems, setPrintItems] = useState([]);
    const [editTasks, setEditTasks] = useState("");
    const [editingId, setEditingId] = useState(null);

    // Add task
    const handleAddOrUpdate = () => {
        if (input === "") {
            alert("Please enter a task");
            return;
        }

        push(ref(db, "todo/"), {
            todo: input
        });

        setInput("");
    };

    // Fetch tasks on load
    useEffect(() => {
        const todoRef = ref(db, "todo/");
        onValue(todoRef, (snapshot) => {
            const arr = [];
            snapshot.forEach((item) => {
                arr.push({ ...item.val(), todoid: item.key });
            });
            setPrintItems(arr);
        });
    }, []);

    // Start editing a task
    const editTask = (item) => {
        setEditingId(item.todoid);
        setEditTasks(item.todo);
    };

    // Save the updated task
    const updateTask = (item) => {
        if (editTasks === "") {
            alert("Please enter something.");
            return;
        }

        const taskRef = ref(db, `todo/${item.todoid}`);
        update(taskRef, { todo: editTasks });

        setEditingId(null);
        setEditTasks("");
    };

    //delete task
    const deleteTask = (todoid) => {
        const taskRef = ref(db, `todo/${todoid}`);
        remove(taskRef);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
            <h1 className="text-2xl font-bold text-center mb-4">📝 To-Do List</h1>

            <div className="flex items-center gap-2 mb-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add a new task"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleAddOrUpdate}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add
                </button>
            </div>

            <ul className="space-y-2">
                {printItems.map((item) => (
                    <li
                        key={item.todoid}
                        className="bg-gray-100 p-3 rounded flex justify-between items-center"
                    >
                        {editingId === item.todoid ? (
                            <div className="flex gap-2 w-full">
                                <input
                                    value={editTasks}
                                    onChange={(e) => setEditTasks(e.target.value)}
                                    className="flex-1 border border-gray-300 px-2 py-1 rounded"
                                />
                                <button
                                    onClick={() => updateTask(item)}
                                    className="bg-green-500 text-white px-3 rounded"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <>
                                <span>{item.todo}</span>
                                <div className="flex gap-4">
                                    <button onClick={() => editTask(item)}>
                                        <PencilLine className="w-5 h-5 text-blue-500 cursor-pointer" />
                                    </button>
                                    <button onClick={() => deleteTask(item.todoid)}>
                                        <Trash2 className="w-5 h-5 text-red-500 cursor-pointer" />
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ToDoList;
