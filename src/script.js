// Event listener to load task list after the page loads
document.addEventListener('DOMContentLoaded', updateUI());

/**
 * Gets input from the user in the taskInput field. Uses saveTask() to create the task element and save it in the storage then call updateUI() to refresh the UI showing the new task
 * @returns {boolean|false} - returns false if theres is a error
 */
function handleTaskInput() {
    try {
        const taskText = document.getElementById('taskInput').value;
        if (!taskText.trim()) {
            alert("Task input is empty.");
            return false;
        };

        saveTask(taskText);
        updateUI();
    } catch(error) {
        console.error('Error handling user input: ', error);
        return false
    };
};

/**
 * Creates a new task object with a unique ID (using Date.now()), the provided text, completion status set to false, a timestamp and a tags field. It validates the input text and returns null if invalid. 
 * @param {string} taskText - The text content of the task
 * @returns {Object|null} The created task object or null if invalid
 */
function createTask(taskText) {
    if (!taskText || typeof taskText != 'string' || taskText.trim() === '') {
        return null;
    };
    return {
        id: Date.now(),
        text: taskText.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        tags: []
    };
};

/**
 * STORAGE ABSTRACTION FUNCTION that retrieves all tasks from localStorage and handles parsing. Returns an empty array if there's an error or no tasks. Doesn't call any other functions.
 * @returns {Array} Array of task objects or empty array if none found
 */
function getTasks() {
    try {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    } catch (error) {
        console.error('Error getting tasks: ', error)
        return [];
    }
};

/**
 * STORAGE ABSTRACTION FUNCTION Handles the localStorage operations by taking an array of tasks and storing it as a JSON string. Uses localStorage.setItem() and JSON.stringify() to persist the data. Returns true if successful, false if there's an error. This function is focused solely on data persistence.
 * @param {Array} tasks - Array of task objects to store
 * @returns {boolean} - Success status of the operation
 */
function storeTasks(tasks) {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        return true;
    } catch (error) {
        console.error('error storing tasks list: ', error);
        return false;
    };
};

/**
 * Orchestrates the task creation and storage process. It calls createTask() to create a new task object, calls getTasks() to retrieves existing tasks, adds the new task to the array, and then calls storeTasks() to save the updated array. Acts as a coordinator between task creation and storage operations.
 * @param {string} taskText - The text content of the task
 * @returns {boolean} - Success status of the operation
 */
function saveTask(taskText) {
    const newTask = createTask(taskText);
    if (!newTask) {
        return false
    }

    try {
        let taskList = getTasks();
        taskList.push(newTask);
        return storeTasks(taskList);
    } catch (error) {
        console.error('Error saving task: ', error);
        return false;
    };
};

/**
 * Creates an html task element with a remove button. Uses bootstrap classes for style. Receives the text object with all properties and puts the removeTask() function inside the button.
 * @param {object} task
 * @returns {object} - html element
 */
function createTaskElement(task) {
    try {
        // Main task item
        const taskElement = document.createElement('li');
        taskElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        // task div for checkbox and text
        const taskContentDiv = document.createElement('div');
        taskContentDiv.classList.add('d-flex', 'align-items-center');

        // task text
        const taskContent = document.createElement('span');
        taskContent.textContent = task.text;

        // task checkbox
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.classList.add('form-check-input', 'me-2');
        taskCheckbox.checked = task.completed;
        taskCheckbox.addEventListener('change', () => toggleTaskStatus(task.id))

        // remove button
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        //icon
        const removeIcon = document.createElement('i');
        removeIcon.classList.add('fa-solid', 'fa-trash');
        removeButton.appendChild(removeIcon);

        removeButton.classList.add('btn', 'btn-warning', 'ms-1');
        removeButton.onclick = function () {
            removeTask(task.id);
        };

        // update button
        const updateButton = document.createElement('button');
        updateButton.type = 'button';
        // icon
        const updateIcon = document.createElement('i');
        updateIcon.classList.add('fa-solid', 'fa-pencil');
        updateButton.appendChild(updateIcon);
        
        updateButton.classList.add('btn', 'btn-secondary', 'me-1', 'ms-1');
        updateButton.onclick = function () {
            updatedTask(task.id);
        };

        // buttons div
        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('d-flex');
        buttonsDiv.appendChild(updateButton);
        buttonsDiv.appendChild(removeButton);

        // adding the components to the main task item
        taskContentDiv.appendChild(taskCheckbox);
        taskContentDiv.appendChild(taskContent)
        taskElement.appendChild(taskContentDiv);
        taskElement.appendChild(buttonsDiv);
        
        return taskElement;
    } catch (error) {
        console.error('Error creating task element: ', error);
        return null
    }
};

/**
 * Uses getTasks() to retrieve all tasks and then resets the UI. Uses createTaskElement() to creat an HTML task object and append it in taskList.
 */
function updateUI() {
    try {
        const taskList = getTasks()
        if (taskList && Array.isArray(taskList)) {
            const taskListArea = document.getElementById('taskList');
            taskListArea.textContent = '';

            taskList.forEach(task => {
                let taskElement = createTaskElement(task);
                taskListArea.appendChild(taskElement);
            });
        };
    } catch (error) {
        console.error('Error updating UI: ', error);
        return false
    };
};

/**
 * Gets the id from the task to remove from the createTaskElement() whe the task HTML element is created. USes getTasks() to retrieve all tasks, finds the index of the desired task and removes it using splice. Then it calls updateUI().
 * @param {*} idToRemove 
 */
function removeTask(idToRemove) {
    try {
        const taskList = getTasks();
        const taskIndex = taskList.findIndex((task) => task.id === idToRemove);
        taskList.splice(taskIndex, 1);
        storeTasks(taskList);
        updateUI()
        return true;
    } catch(error) {
        console.error('Error removing task: ', error);
        return false;
    };
};

function toggleTaskStatus(taskId) {
    return;
};


function updatedTask(taskId) {
    return;
};
