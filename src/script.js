// Event listener to load task list after the page loads
document.addEventListener('DOMContentLoaded', updateUI());


function handleTaskInput() {

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
 * Creates an html task element with a remove button. Uses bootstrap classes for style. Receives the text as a param and puts the removeTask() function inside the button.
 * @param {string} taskText 
 * @returns {object} - html element
 */
function createTaskElement(taskText) {
    try {
        const taskElement = document.createElement('li');
        taskElement.textContent = taskText;

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.textContent = 'X';
        removeButton.classList.add('btn', 'btn-warning');
        removeButton.onclick = function () {
            removeTask(this);
        };

        taskElement.appendChild(removeButton);
        return taskElement;
    } catch (error) {
        console.error('Error creating task element: ', error);
        return null
    }
};

/**
 * Resets the user interface. Receives an array os strings with the tasks, uses createTaskElement() to creat an HTML task object and append it in taskList.
 * @param {array} taskList 
 */
function updateUI(taskList) {
    try {
        if (taskList && Array.isArray(taskList)) {
            const taskListArea = document.getElementById('taskList');
            taskListArea.textContent = '';

            taskList.forEach(task => {
                let taskElement = createTaskElement(task.text);
                taskListArea.appendChild(taskElement);
            });
        };
    } catch (error) {
        console.error('Error updating UI: ', error);
        return false
    };
}