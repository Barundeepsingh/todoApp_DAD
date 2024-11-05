import React from "react";
import "./TaskColumn.css";
import TaskCard from '../TaskCard/TaskCard';
import DropArea from "../DropArea/DropArea";

const TaskColumn = ({ title,body, icon, tasks = [], status, handleDelete, handleUpdate, setActiveCard, onDrop }) => {
    console.log("this is the task",tasks);
    return (
        <section className='task_column'>
            <h2 className='task_column_heading'>
                <img className='task_column_icon' src={icon} alt='' /> {title}
            </h2>

            <DropArea onDrop={() => onDrop(status, 0)} />

            {tasks.map(
                (task, index) =>
                    task.status === status && (
                        <React.Fragment key={task._id}>
                            <TaskCard
                                title={task.title}
                                body = {task.body}
                                tags={task.tags}
                                handleDelete={handleDelete}
                                handleUpdate={handleUpdate}
                                taskId={task._id}
                                index={index}
                                setActiveCard={setActiveCard}
                                createdAt = {task.createdAt}
                            />
                            <DropArea onDrop={() => onDrop(status, index + 1)} />
                        </React.Fragment>
                    )
            )}
        </section>
    );
};

export default TaskColumn;
