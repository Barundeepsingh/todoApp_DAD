import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TodoList.css";
import TaskForm from "../../components/TaskForm/TaskForm";
import TaskColumn from "../../components/TaskColumn/TaskColumn";
import todoIcon from "../../assets/direct-hit.png";
import doingIcon from "../../assets/glowing-star.png";
import doneIcon from "../../assets/check-mark-button.png";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const uid = localStorage.getItem('uid')

  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Fetching task with UID", uid);
      try {
      const response = await axios.get("http://localhost:5000/tasks",{
        params:{uid: uid}
      });
      setTasks(response.data);
    }catch(error){
      console.error('Error fetching Tasks', error)
    }
    };
    fetchTasks();
  }, [uid]);

  const handleDelete = async (taskId) => {
    console.log("this needed to deleted",taskId)
    try {
    await axios.delete(`http://localhost:5000/deleteTasks/${taskId}`);
    setTasks(tasks.filter((task) => task._id !== taskId));
    }catch(error){
      console.error('Error deleting task', error)
    }
  };

  const handleUpdate = async (taskId, updatedTitle, updatedBody) => {
    console.log("Updating task with ID:", taskId);
    try {
        await axios.put(`http://localhost:5000/updateTasks/${taskId}`, {
            title: updatedTitle,
            body: updatedBody,
        });

        // Update the task in the state
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task._id === taskId ? { ...task, title: updatedTitle, body: updatedBody } : task
            )
        );
    } catch (error) {
        console.error("Error updating task", error);
    }
};

  const onDrop = async (status, position) => {
    if (activeCard == null || activeCard === undefined) return;

    const taskToMove = tasks[activeCard];
    const updatedTasks = tasks.filter((task, index) => index !== activeCard);

    updatedTasks.splice(position, 0, {
      ...taskToMove,
      status: status,
    });

    setTasks(updatedTasks);

    // Update task status in the database
    await axios.put(`http://localhost:5000/updateTasks/${taskToMove._id}`, {
      ...taskToMove,
      status: status,
    });
  };

  const addTask = async (task) => {
    try {
      console.log("task which is being added", task);
      const taskWithUid = {...task, uid:uid};
      console.log("task with uid", taskWithUid);
      const response = await axios.post("http://localhost:5000/addTasks", taskWithUid);
      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="app">
      <TaskForm addTask={addTask} />
      <main className="app_main">
        <TaskColumn
          title="To do"
          icon={todoIcon}
          tasks={tasks.filter((task) => task.status === "todo")}
          status="todo"
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
        />
        <TaskColumn
          title="Doing"
          icon={doingIcon}
          tasks={tasks.filter((task) => task.status === "doing")}
          status="doing"
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
        />
        <TaskColumn
          title="Done"
          icon={doneIcon}
          tasks={tasks.filter((task) => task.status === "done")}
          status="done"
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          setActiveCard={setActiveCard}
          onDrop={onDrop}
        />
      </main>
    </div>
  );
};

export default TodoList;
