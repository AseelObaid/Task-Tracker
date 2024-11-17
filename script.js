/************************************************* عرف المتغيرات *************************************************************/
var data = [];
var taskname = document.getElementById("taskname");
var datepicker = document.getElementById("datepicker");
var timepicker = document.getElementById("timepicker");
var taskIndex = document.getElementById("taskIndex");
var parentInput = document.getElementById("parent");
window.onload = function () {
    data = JSON.parse(localStorage.getItem("tasks")) || [];
    if (parentInput) {
        rendertask();
    }
/************************************************* قراءة البيانات من URL***************************************************************/

    
    const params = new URLSearchParams(window.location.search);
    const tasknameurl = params.get("nametask");
    const taskdateurl = params.get("taskdate");
    const tasktimeurl = params.get("tasktime");
    const taskindexrl = params.get("index");

    if (tasknameurl && taskdateurl && tasktimeurl && taskindexrl !== null && taskindexrl !== "") {
        taskname.value = tasknameurl;
        datepicker.value = taskdateurl;
        timepicker.value = tasktimeurl;
        taskIndex.value = taskindexrl;
    }
};

/************************************************* render task ***************************************************************/
function rendertask() {
    if (data.length === 0) {
        parentInput.innerHTML = "<p>No tasks found.</p>";
        return;
    }

    let dataHTML = "";
    for (let i = 0; i < data.length; i++) {
        dataHTML += `
        <div class="child " id="div-${i}">
         <h2>${data[i].name}</h2>
            <p> <i class="fa-regular fa-calendar"></i> ${data[i].date}</p>
            <p>   <i class="fa-regular fa-clock"></i>  ${data[i].time}</p>
            <button class="btn-info" onclick="update(${i})">Update</button>
            <button class="btn-danger" onclick="Delete(${i})">Delete</button>
            <p id="time-left-${i}"> ${timeleft(data[i].date, data[i].time,i)}</p>
        </div>`;
    }

    parentInput.innerHTML = dataHTML;


  
}
/**?****************************************************تحديث الوقت كل خمس ثواني********************************************************************* */
setInterval(() => {
    data.forEach((task,index)=>{
        let x=document.getElementById(`time-left-${index}`)
      
    if(x){
        x.textContent=timeleft(task.date,task.time,index)
      
    }
    })

}, 1000);


/************************************************* إضافة أو تعديل مهمة *******************************************************/
function addOrUpdateTask(event) {
    event.preventDefault();

    // تحقق من الحقول
    if (!taskname.value.trim() || !datepicker.value.trim() || !timepicker.value.trim()) {
        alert("Please fill in all fields.");
        return;
    }

    if (taskIndex.value === "") {
   
        data.push({
            name: taskname.value.trim(),
            date: datepicker.value.trim(),
            time: timepicker.value.trim()
        });
    } else {
      
        data[parseInt(taskIndex.value)] = { 
            name: taskname.value,
            date: datepicker.value,
            time: timepicker.value
        };
        taskIndex.value = ""; 
    }

   
    localStorage.setItem("tasks", JSON.stringify(data));

    window.location.href = "./tasks.html";
}

/************************************************* تحديث المهمة ***************************************************************/
function update(index) {
    const params = new URLSearchParams({
        nametask: data[index].name,
        taskdate: data[index].date,
        tasktime: data[index].time,
        index: index,
    }).toString();
    window.location.href = `./addtask.html?${params}`;
}

/*************************************************حذف مهمة*******************************************************/

function Delete(index){
    if(confirm(`Are you sure to delete the task ${data[index].name}?`))
    {
        data.splice(index,1);
        localStorage.setItem("tasks",JSON.stringify(data));
        rendertask()
    }
}
/*********************************************************الوقت المتبقيى ************************************************************* */
/************************************************* الوقت المتبقي *************************************************************/
function timeleft(date, time, index) {
    let timestring = `${date}T${time}`;
    let timeobject = new Date(timestring);
    let currenttime = new Date();
    let difference = timeobject - currenttime;
    let y = document.getElementById(`div-${index}`);

    if (difference < 0) {
        if (y) {
          
            y.style.backgroundColor = '#f74242';
        }
        return 'Time Left';
    }

    let days = Math.floor(difference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); 
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)); 
    let seconds = Math.floor((difference % (1000 * 60)) / 1000); 

    return ` remaining time: Days: ${days}  Hours: ${hours} 
    Minutes: ${minutes} Seconds: ${seconds}`;
}

