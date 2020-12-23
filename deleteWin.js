const {ipcRenderer} = require('electron')

// Submit buttons

const deleteButton = document.getElementById("deleteButton");

// Button event listeners

deleteButton.addEventListener('click', deleteStudent);


// Delete Pasta
function deleteStudent(){
    var pID = parseInt(document.getElementById("student_id").value);
	ipcRenderer.send('item:delete', pID) //call to index.js
	
}


