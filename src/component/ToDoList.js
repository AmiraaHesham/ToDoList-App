import React from 'react';
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrTask } from "react-icons/gr";
import { useState, useRef, useEffect } from 'react';
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IoIosArrowDropright } from "react-icons/io";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import axios from 'axios';
import Swal from 'sweetalert2';
let currentIndex = 0;

const ToDoList = () => {

    const [tasks, settasks] = useState([])
    const [inputtask, setinputtask] = useState([])
    const [taskscompleted, settaskscompleted] = useState([])
    const inputRef = useRef()


    useEffect(() => {
        getAllTasks()
    }, [])
    useEffect(() => {
        getAllTasksCompleted()
    }, [])

    const getAllTasks = async () => {
        const res = await axios.get('http://localhost:8000/tasks')
        await settasks(res.data);
    }

    const getAllTasksCompleted = async () => {
        const res = await axios.get('http://localhost:8000/completedTask')
        await settaskscompleted(res.data);

    }

    const handelAddTask = async () => {
        if (inputRef.current.value !== '') {
            const res = await axios.post('http://localhost:8000/tasks', {
                title: inputtask
            })
            await getAllTasks(res)
            inputRef.current.value = ''
        }
    }

    const handleTaskDone = async (task) => {
        await axios.delete(`http://localhost:8000/tasks/${task.id}`)
        await getAllTasks()

        const res2 = await axios.post('http://localhost:8000/completedTask', {
            title: task.title,
        })
        await getAllTasksCompleted(res2)
    }

    const handelNotCompleted = async (taskDone) => {
        await axios.delete(`http://localhost:8000/completedTask/${taskDone.id}`)
        await getAllTasksCompleted()

        const res2 = await axios.post('http://localhost:8000/tasks', {
            title: taskDone.title,
        })
        await getAllTasks(res2)
    }

    const handleDeleteTask = (task) => {
        Swal.fire({
            title: `${task.title}`,
            text: 'Are You Sure Delete Task?',
            showCancelButton: true,
        }).then(async (data) => {
            if (data.isConfirmed) {
                const res2 = await axios.delete(`http://localhost:8000/tasks/${task.id}`)
                getAllTasks(res2)
            }
        })
    }

    const handelDeleteAll = () => {
        Swal.fire({
            title: 'Are You Sure Delete All Task?',
            showCancelButton: true,
        }).then((data) => {
            if (data.isConfirmed) {
                tasks.forEach(async (element) => {
                    await axios.delete(`http://localhost:8000/tasks/${element.id}`)
                    await getAllTasks()
                });
                taskscompleted.forEach(async (element) => {
                    await axios.delete(`http://localhost:8000/completedTask/${element.id}`)
                    await getAllTasksCompleted()
                });


            }
        })


    }

    const handelUpdate = (task) => {
        currentIndex = task.id;
        let addTaskDiv = document.querySelector("#addTaskDiv");
        let editTaskDiv = document.querySelector("#editTaskDiv");
        addTaskDiv.classList.add("hide");
        editTaskDiv.classList.remove("hide");
        inputRef.current.value = task.title;
    }

    const handelSave = async () => {
        const res = await axios.put(`http://localhost:8000/tasks/${currentIndex}`,
            { title: inputtask }
        )
        getAllTasks(res)
        inputRef.current.value = ''
    }

    const handelCancel = () => {
        inputRef.current.value = "";
        let addTaskDiv = document.querySelector("#addTaskDiv");
        let editTaskDiv = document.querySelector("#editTaskDiv");
        addTaskDiv.classList.remove("hide");
        editTaskDiv.classList.add("hide");
    }

    const handlebtnsDown = () => {
        let btnDown = document.querySelector("#btnDown");
        let btnRight = document.querySelector("#btnRight");
        btnDown.classList.add("hide");
        btnRight.classList.remove("hide");
        let doneTask = document.querySelector("#doneTask");
        doneTask.classList.add("hide");
    }

    const handlebtnsRight = () => {
        let btnDown = document.querySelector("#btnDown");
        let btnRight = document.querySelector("#btnRight");
        let doneTask = document.querySelector("#doneTask");
        doneTask.classList.remove("hide");
        btnDown.classList.remove("hide");
        btnRight.classList.add("hide");
    }

    useEffect(() => {
        inputRef.current.focus();
    }, [tasks])

    return (
        <>
            <div className='ToDoList'>
                <h2><GrTask /> Today's Tasks</h2>

                <div className='To-Do-container'>

                    <div className='addTask'>
                        <input id='task' onChange={(e) => setinputtask(e.target.value)} ref={inputRef} placeholder='Enter Task...' />
                    </div>

                    <div className='btns'>
                        <div id='addTaskDiv'>
                            <button id='btnAdd' onClick={handelAddTask} >Add</button>
                            <button id='btndelall' onClick={handelDeleteAll}>Delete All</button>
                        </div>
                    </div>

                    <span > {tasks.map((task, index) => {
                        return <div>
                            <div className='hide' id='editTaskDiv'>
                                <button id='btnSave' onClick={() => handelSave(task)} >Save</button>
                                <button id='btnCancel' onClick={handelCancel} >Cancel</button>
                            </div>

                            <div className='item'>
                                <div id='widthDiv' onClick={() => handleTaskDone(task)}  >
                                    <IoCheckmarkDoneCircleOutline />
                                    <span id='space' key={index} >
                                        {task.title}
                                        <br></br>
                                    </span>

                                </div>

                                <div className='btn-del-upd'>
                                    <span id='btnupd' onClick={() => handelUpdate(task)}><FiEdit /></span>
                                    <span id='btndel' onClick={() => handleDeleteTask(task)}><RiDeleteBin6Line /></span>
                                </div>


                            </div>
                        </div>

                    })}
                        <div >
                            <div id='showCompleted' >
                                <h4 id='btnRight' className='hide' onClick={handlebtnsRight}><IoIosArrowDropright />Completed</h4>
                                <h4 id='btnDown' onClick={handlebtnsDown} > <IoIosArrowDropdownCircle />Completed</h4>
                            </div>
                            < div id='doneTask'>
                                <span>{taskscompleted.map((taskDone, index) => {
                                    return <div id='completedTask' onClick={() => handelNotCompleted(taskDone)}>
                                        <IoCheckmarkDoneCircleSharp />
                                        <span id='space' className="done" key={index}  >
                                            {taskDone.title}

                                        </span>

                                    </div>
                                })}
                                </span>
                            </div>
                        </div>
                    </span>


                </div>
            </div>
        </>
    )
}

export default ToDoList
