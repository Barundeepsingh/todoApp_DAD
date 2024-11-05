import React, { useState } from "react";
import "./TaskForm.css";

const TaskForm = ({ addTask }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    body: "",
    status: "todo",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;

    setTaskData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(taskData);
    setTaskData({
      title: "",
      body: "",
      status: "todo",
    });
  };

  return (
    <header className="app_header">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={taskData.title}
          className="task_input"
          placeholder="Enter your task title"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="body"
          value={taskData.body}
          className="task_input"
          placeholder="Enter your task"
          onChange={handleChange}
          required
        />
        <div className="task_form_bottom_line">
{/*          <div>
            <Tag
              tagName="HTML"
              selectTag={selectTag}
              selected={checkTag("HTML")}
            />
            <Tag
              tagName="CSS"
              selectTag={selectTag}
              selected={checkTag("CSS")}
            />
            <Tag
              tagName="JavaScript"
              selectTag={selectTag}
              selected={checkTag("JavaScript")}
            />
            <Tag
              tagName="React"
              selectTag={selectTag}
              selected={checkTag("React")}
            />
          </div>*/}
          <div>
            <select
              name="status"
              value={taskData.status}
              className="task_status"
              onChange={handleChange}
            >
              <option value="todo">TODO</option>
              <option value="doing">IN PROGRESS</option>
              <option value="done">DONE</option>
            </select>
            <button type="submit" className="task_submit">
              + Add Task
            </button>
          </div>
        </div>
      </form>
    </header>
  );
};

export default TaskForm;
