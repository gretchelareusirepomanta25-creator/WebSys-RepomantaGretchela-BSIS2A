const currentTime = document.getElementById("currentTime");

function updateClock() {
    currentTime.textContent = `Local time: ${new Date().toLocaleTimeString()}`;
}

updateClock();
setInterval(updateClock, 1000);

const themeButton = document.getElementById("themeToggle");

function updateThemeButton() {
    const isDarkMode = document.body.classList.contains("dark-mode");
    themeButton.textContent = isDarkMode ? "Switch to light mode" : "Switch to dark mode";
    themeButton.setAttribute("aria-pressed", String(isDarkMode));
}

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}
updateThemeButton();

themeButton.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", theme);
    updateThemeButton();
});

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

document.getElementById("addTaskButton").addEventListener("click", function() {
    const taskText = taskInput.value.trim();
    if (!taskText) {
        taskInput.focus();
        return;
    }

    const task = document.createElement("li");
    const taskLabel = document.createElement("span");
    const removeButton = document.createElement("button");
    taskLabel.textContent = taskText;
    removeButton.type = "button";
    removeButton.className = "removeTask";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove task: ${taskText}`);
    task.append(taskLabel, removeButton);
    taskList.appendChild(task);
    taskInput.value = "";
    taskInput.focus();
});

taskList.addEventListener("click", function(event) {
    if (event.target instanceof Element && event.target.closest(".removeTask")) {
        event.target.closest("li").remove();
    }
});

const modal = document.getElementById("modal");
const modalMessage = document.getElementById("modalMessage");

document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    modalMessage.textContent = `Thanks, ${name}! Your message is ready. This demo does not send messages yet.`;
    modal.style.display = "flex";
    modal.removeAttribute("aria-hidden");
    document.getElementById("closeModal").focus();
});

function closeModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
}

document.getElementById("closeModal").addEventListener("click", closeModal);

modal.addEventListener("click", function(event) {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && modal.style.display === "flex") {
        closeModal();
    }
});
