window.onload = function () {
  class PomodoroApp {
    constructor(displayId, alarmId, endTextId) {
      this.initial = 1500;
      this.time = this.initial;
      this.running = false;
      this.locked = false;
      this.timer = null;
      this.display = document.getElementById(displayId);
      this.alarm = document.getElementById(alarmId);
      this.endText = document.getElementById(endTextId);
      this.buttons = [
        "startBtn",
        "pauseBtn",
        "resetBtn",
        "breakBtn",
        "openTasks"
      ].map(id => document.getElementById(id));
      this.updateDisplay();
    }

    updateDisplay() {
      const min = String(Math.floor(this.time / 60)).padStart(2, "0");
      const sec = String(this.time % 60).padStart(2, "0");
      this.display.textContent = `${min}:${sec}`;
    }

    start() {
      if (this.running || this.locked) return;
      this.endText.style.display = "none";
      this.running = true;
      this.timer = setInterval(() => {
        if (this.time > 0) {
          this.time--;
          this.updateDisplay();
        } else {
          this.stop();
          this.endText.style.display = "block";
          this.alarm.play();
        }
      }, 1000);
    }

    pause() {
      clearInterval(this.timer);
      this.running = false;
    }

    stop() {
      this.pause();
    }

    reset() {
      this.pause();
      this.time = this.initial;
      this.updateDisplay();
      this.endText.style.display = "none";
    }

    break1Min() {
      this.pause();
      this.time = 60;
      this.updateDisplay();
      this.start();
    }

    toggleLock() {
      this.locked = !this.locked;
      this.buttons.forEach(btn => btn.disabled = this.locked);
      alert(this.locked ? "🔒 Screen Locked" : "🔓 Screen Unlocked");
    }
  }

  class ToDoList {
    constructor(inputId, listId, modalId) {
      this.input = document.getElementById(inputId);
      this.list = document.getElementById(listId);
      this.modal = document.getElementById(modalId);
      this.loadTasks();
    }

    open() {
      this.modal.style.display = "block";
      this.loadTasks();
    }

    close() {
      this.modal.style.display = "none";
    }

    addTask() {
      const task = this.input.value.trim();
      if (!task) return;
      const tasks = this.getTasks();
      tasks.push(task);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      this.input.value = "";
      this.loadTasks();
    }

    loadTasks() {
      const tasks = this.getTasks();
      this.list.innerHTML = "";
      tasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task;
        this.list.appendChild(li);
      });
    }

    clearTasks() {
      if (confirm("Clear all tasks?")) {
        localStorage.removeItem("tasks");
        this.loadTasks();
      }
    }

    getTasks() {
      return JSON.parse(localStorage.getItem("tasks") || "[]");
    }
  }

  const timer = new PomodoroApp("timer", "alarm", "endText");
  const todo = new ToDoList("taskInput", "taskList", "taskModal");

  document.getElementById("startBtn").onclick = () => timer.start();
  document.getElementById("pauseBtn").onclick = () => timer.pause();
  document.getElementById("resetBtn").onclick = () => timer.reset();
  document.getElementById("breakBtn").onclick = () => timer.break1Min();
  document.getElementById("lockBtn").onclick = () => timer.toggleLock();

  document.getElementById("openTasks").onclick = () => todo.open();
  document.getElementById("closeTasks").onclick = () => todo.close();
  document.getElementById("addTask").onclick = () => todo.addTask();
  document.getElementById("clearTasks").onclick = () => todo.clearTasks();
};
