// для шапки
const nav = document.querySelector('#nav');
const navBtn = document.querySelector('#nav-btn');
const navBtnImg = document.querySelector('#nav-btn-img');

navBtn.onclick = () => {
    if (nav.classList.toggle('open')) {
        navBtnImg.src = "/img/nav-close.svg";
    } else {
        navBtnImg.src = '/img/nav-open.svg';
    }
}


// для модального окна

const modal = document.getElementById('modal');
const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const taskInput = document.getElementById('taskInput');

openBtn.addEventListener('click', () => {
    modal.showModal();
    taskInput.value = '';
});

closeBtn.addEventListener('click', () => {
    modal.close();
});

document.getElementById('taskForm').addEventListener('submit', (event) => {
    event.preventDefault();
    addTask();
});

window.onclick = function (event) {
    if (event.target == modal) {
        modal.close();
    }
};


function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
                    <label>
                        <input type="checkbox" class="real-checkbox" onclick="moveToInProgress(this)">
                        <span class="custom-checkbox"></span>
                        ${taskText}
                    </label>
                    <button class="delete-button" onclick="removeTask(this)">X</button>`;
        document.getElementById('taskList').appendChild(taskItem);
        taskInput.value = '';
        modal.close();
    }
}

// 5 лабораторная

const actionHistory = [];

openBtn.addEventListener('click', () => {
    modal.showModal();
});

closeBtn.addEventListener('click', () => {
    modal.close();
});

document.getElementById('taskForm').addEventListener('submit', (event) => {
    event.preventDefault();
    addTask();
});

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const taskItem = createTaskItem(taskText);
        document.getElementById('taskList').appendChild(taskItem);
        saveTasksInLocalStorage();
        taskInput.value = '';
        modal.close();
    }
}

function createTaskItem(taskText) {
    const taskItem = document.createElement('li');
    const button = document.createElement('button');
    button.className = "delete-button";
    button.textContent = "X";
    button.onclick = () => removeTask(taskItem);
    taskItem.innerHTML = `
                    <label>
                        <input type="checkbox" class="real-checkbox" onclick="moveToInProgress(this)">
                        <span class="custom-checkbox"></span>
                        ${taskText}
                    </label>`;
    taskItem.appendChild(button);
    return taskItem;
}

function moveToInProgress(checkbox) {
    const taskItem = checkbox.closest('li');
    if (checkbox.checked) {
        const taskText = taskItem.textContent.replace("X", "").trim();
        const inProgressItem = createInProgressItem(taskText);
        document.getElementById('inProgressList').appendChild(inProgressItem);
        taskItem.remove();
        saveTasksInLocalStorage();
    }
}

function createInProgressItem(taskText) {
    const inProgressItem = document.createElement('li');
    const button = document.createElement('button');
    button.className = "delete-button";
    button.textContent = "X";
    button.onclick = () => removeTask(inProgressItem);
    inProgressItem.innerHTML = `
                    <label>
                        <input type="checkbox" class="real-checkbox" onclick="moveToCompleted(this)">
                        <span class="custom-checkbox"></span>
                        ${taskText}
                    </label>`;
    inProgressItem.appendChild(button);
    return inProgressItem;
}

function moveToCompleted(checkbox) {
    const taskItem = checkbox.closest('li');
    if (checkbox.checked) {
        const taskText = taskItem.textContent.replace("X", "").trim();
        const completedItem = createCompletedItem(taskText);
        document.getElementById('completedList').appendChild(completedItem);
        taskItem.remove();
        saveTasksInLocalStorage();
    }
}

function createCompletedItem(taskText) {
    const completedItem = document.createElement('li');
    const button = document.createElement('button');
    button.className = "delete-button";
    button.textContent = "X";
    button.onclick = () => removeTask(completedItem);
    completedItem.innerHTML = `
                    ${taskText} 
                    `;
    completedItem.appendChild(button);
    return completedItem;
}

function removeTask(taskItem) {
    const taskText = taskItem.textContent.replace("X", "").trim();
    // Сохранение удаленной задачи в истории
    addToHistory(taskText);
    taskItem.remove();
    saveTasksInLocalStorage();
    addActionToHistory({ type: actionType, taskText: textContent, timestamp: Date.now() });
    updateHistoryElement();
}

function saveTasksInLocalStorage() {
    const tasks = Array.from(document.querySelectorAll('#taskList li')).map(item => {
        return item.textContent.replace("X", "").trim();
    });
    const inProgressTasks = Array.from(document.querySelectorAll('#inProgressList li')).map(item => {
        return item.textContent.replace("X", "").trim();
    });
    const completedTasks = Array.from(document.querySelectorAll('#completedList li')).map(item => {
        return item.textContent.replace("X", "").trim();
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('inProgressTasks', JSON.stringify(inProgressTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const inProgressTasks = JSON.parse(localStorage.getItem('inProgressTasks')) || [];
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    tasks.forEach(taskText => {
        const taskItem = createTaskItem(taskText);
        document.getElementById('taskList').appendChild(taskItem);
    });

    inProgressTasks.forEach(taskText => {
        const inProgressItem = createInProgressItem(taskText);
        document.getElementById('inProgressList').appendChild(inProgressItem);
    });

    completedTasks.forEach(taskText => {
        const completedItem = createCompletedItem(taskText);
        document.getElementById('completedList').appendChild(completedItem);
    });
}

function addToHistory(taskText) {
    const history = JSON.parse(localStorage.getItem('taskHistory')) || [];
    history.push({ task: taskText, timestamp: new Date().toISOString() });

    if (history.length > 10) {
        history.splice(0, history.length - 10);
    }

    localStorage.setItem('taskHistory', JSON.stringify(history));
}

function displayTaskHistory() {
    const history = JSON.parse(localStorage.getItem('taskHistory')) || [];
    const historyContainer = document.createElement('div');
    historyContainer.id = "historyContainer";
    historyContainer.innerHTML = "<h2>история изменений задач</h2>";
    historyContainer.className = "history-container";

    history.forEach(entry => {
        const historyItemWrapper = document.createElement('div');
        historyItemWrapper.className = "history-item-wrapper";
        const historyItem = document.createElement('div');
        historyItem.className = "history-item";
        historyItem.textContent = `${entry.task}   (удалено: ${new Date(entry.timestamp).toLocaleString()})`;
        const restoreButton = document.createElement('button');
        restoreButton.textContent = "восстановить";
        restoreButton.className = "restore-button";
        restoreButton.onclick = () => restoreTask(entry.task);
        historyItem.appendChild(restoreButton);
        historyContainer.appendChild(historyItem);

        historyItemWrapper.appendChild(historyItem);
        historyItemWrapper.appendChild(restoreButton);

        historyContainer.appendChild(historyItemWrapper);
    });

    document.body.appendChild(historyContainer);
}

function restoreTask(taskText) {
    const taskItem = createTaskItem(taskText);
    document.getElementById('taskList').appendChild(taskItem);
    addToHistory(taskText);
    saveTasksInLocalStorage();
}

window.onload = () => {
    loadTasksFromLocalStorage();
    displayTaskHistory();
}


