"use strict"


let taskList = [];

if(localStorage.getItem("taskList") !== null){
    taskList = JSON.parse(localStorage.getItem("taskList")); 
}else{

}

displayTasks("all");

const  txtTaskInput = document.querySelector('#txtTaskInput');
const deleteAll = document.querySelector('#deleteAll');

let updateId;
let isUpdateTask = false;

function displayTasks(filter) { // it'll list all tasks when the function called

    let ul = document.querySelector('#task-list');
    ul.innerHTML = '';

    if(taskList.length == 0){
        ul.innerHTML = "<p class='p-4 m-0'> Hiçbir görev bulunmamaktadır.</p>"
    }else{
      
    for (let task of taskList) {

        let completed = task.state == "completed" ? "checked" : "";

        if(filter == task.state || filter == "all"){
            let li = `
    <li class="task list-group-item">
        <div class="form-check">
            <input type="checkbox" onclick="updateCheckbox(this)" id="${task.id}" class="form-check-input" ${completed}>
            <label for="${task.id}" class="form-check-label ${completed}">${task.taskName}</label>
        </div>

        <div class="dropdown">
        <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fa fa-solid fa-ellipsis"></i>
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a onclick="DeleteTask(${task.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash"></i> Kaldır</a></li>
            <li><a onclick="UpdateTask(${task.id},'${task.taskName}')" class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle</a></li>
        </ul>
        </div>
    </li>   
        `;
         ul.insertAdjacentHTML('beforeend', li);
        }
        
    }
    }

}


document.querySelector('.btn-add').addEventListener('click', function(event) { // add a task to task list when click add button

    if (txtTaskInput.value == '') {
        window.alert('Görev boş olamaz!');
    } else {

        if(!isUpdateTask){
            //add process
            taskList.push({ "id": taskList.length + 1, "taskName": txtTaskInput.value, state: "pending" });
        }else{
            //update process
            for(let task of taskList){
                if(task.id == updateId){
                    task.taskName = txtTaskInput.value;
                }
            }

            isUpdateTask = false;
        }
        txtTaskInput.value = '';
        displayTasks(document.querySelector("span.active").id);  
        localStorage.setItem("taskList",JSON.stringify(taskList));
    }
    

    event.preventDefault();

});

function DeleteTask(id) {

    //     for (let index in taskList) {
    //         if (taskList[index].id == id) {
    //             taskList.splice(index, 1);
    //         }
    //     }

    taskList.splice(taskList.findIndex(task => task.id == id), 1);

    displayTasks(document.querySelector(".filters span.active").id);
    localStorage.setItem("taskList",JSON.stringify(taskList));
}

function UpdateTask(id, taskName){

    updateId = id;
    isUpdateTask = true;
    txtTaskInput.value = taskName;
    txtTaskInput.focus();
    txtTaskInput.classList.add('active');
}

deleteAll.addEventListener('click', function(){

    if(confirm("Tüm görevleri silmek istediğinize emin misiniz?")){
        taskList.splice(0,taskList.length);
        localStorage.setItem("taskList",JSON.stringify(taskList));
        displayTasks();
    }
});

function updateCheckbox(checkbox){
    let label = checkbox.nextElementSibling;
    let state; 

    if(checkbox.checked){
        label.classList.add("checked");
        state = "completed";
    }else{
        label.classList.remove("checked");
        state = "pending";  
    }

    for(let task of taskList){
        if(task.id == checkbox.id){
            task.state = state;
        }
    }

    displayTasks(document.querySelector("span.active").id);

    localStorage.setItem("taskList",JSON.stringify(taskList));
}

let filters = document.querySelectorAll(".filters span");

for(let span of filters){
    span.addEventListener("click",function(){
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        displayTasks(span.id);
    });
}