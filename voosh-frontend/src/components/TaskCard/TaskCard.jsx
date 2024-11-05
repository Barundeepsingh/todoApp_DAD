import React, { useState } from "react";
import "./TaskCard.css";
import Tag from "../Tag/Tag";
import deleteIcon from "../../assets/delete.png";
import editIcon from "../../assets/edit.png";

const TaskCard = ({ title, body, createdAt, tags = [], handleDelete, handleUpdate, taskId, setActiveCard, index }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState(title);
    const [updatedBody, setUpdatedBody] = useState(body);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString(); 
        return `${formattedDate} ${formattedTime}`;
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const saveChanges = () => {
        handleUpdate(taskId, updatedTitle, updatedBody);
        closeModal();
    };

    return (
        <>
            <article
                className='task_card'
                draggable
                onDragStart={() => setActiveCard(index)}
                onDragEnd={() => setActiveCard(null)}
            >
                <p className='task_text'>{updatedTitle}</p>
                <p className='task_body'>{updatedBody}</p>
                <p className='task_time'>created At: {formatDate(createdAt)} </p>

                <div className='task_card_bottom_line'>
                    <div className='task_card_tags'>
                        {tags.map((tag, idx) => (
                            <Tag key={idx} tagName={tag} selected />
                        ))}
                    </div>

                    <div className='task_delete' onClick={() => handleDelete(taskId)}>
                        <img src={deleteIcon} className='delete_icon' alt='' />
                    </div>

                    <div className='task_update' onClick={openModal}>
                        <img src={editIcon} className='update_icon' alt='' />
                    </div>
                </div>
            </article>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Edit Task</h2>
                        <input
                            type="text"
                            value={updatedTitle}
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                            placeholder="Update title"
                            required
                            onInvalid={(e) => e.target.setCustomValidity("Please fill out this field")}
                        />
                        <textarea
                            value={updatedBody}
                            onChange={(e) => setUpdatedBody(e.target.value)}
                            placeholder="Update body"
                            required
                            onInvalid={(e) => e.target.setCustomValidity("Please fill out this field")}
                        />
                        <div className="modal-buttons">
                            <button onClick={saveChanges} disabled={updatedTitle.trim() === '' && updatedBody.trim() === ''}>Save</button>
                            <button onClick={closeModal} disabled={updatedTitle.trim() === '' && updatedBody.trim() === ''}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskCard;
