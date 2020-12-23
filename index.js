//imports
const path = require('path');
const url = require('url');
let knex =require ("knex")({
  client:"sqlite3",
  connection:{
    filename:"./student.db"
  },
  useNullAsDefault:true
});
//deconstruct imports
const { app, BrowserWindow, Menu, ipcMain,globalShortcut } = require('electron');

//variables for windows
let mainWindow;
let addWindow;
let editWindow;
let deleteWindow;

//function to create main window
function createWindow() {
  mainWindow = new BrowserWindow( {
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('mainwindow.html')
  //mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function() {
    app.quit();
  });

  let menu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(menu)

}//end createWindow

//function to create window for Adding
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 650,
    height: 550,
    title: 'Add Item',
    webPreferences: {
      nodeIntegration: true
    }
  });

  addWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'addwindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  readDB()
  
  addWindow.on('close', function() {
    addWindow = null;
  });
}

function createEditWindow(){
  editWindow = new BrowserWindow({
    width: 700,
    height: 700,
    title: 'Edit Item',
    webPreferences: {
      nodeIntegration: true
    },
  })

  editWindow.loadFile('editWindow.html')
  //editWindow.webContents.openDevTools();
  editWindow.on('close', function() {
    editWindow = null;
  });

}//end createEditWindow
//function to create window for  Deletes
function createDeleteWindow(){
  deleteWindow = new BrowserWindow({
    width: 450,
    height: 250,
    title: 'Remove student details',
    webPreferences: {
      nodeIntegration: true
    },
  })

  deleteWindow.loadFile('deleteWindow.html')

  deleteWindow.on('close', function() {
    deleteWindow = null;
  });

}//end createDeleteWindow

// create *******************
ipcMain.on('item:add', function(e, name,email,phone,address,tuition,year) {
 
  knex("studentTable").insert({
    name:name,email:email,phone:phone,address:address,tuition:tuition,year:year
  }).then(() => console.log(name +": data inserted"))
  .catch(err =>{console.log(err)}) 
  .then(() => readDB())
  addWindow.close();
});

//Update / Delete
ipcMain.on('item:delete', function(e, id){
  console.log(id + ": got here index.js delete function");
  knex('studentTable').where({"studentId" : id}).del()
  .catch(err =>{console.log(err)})
  .then(() =>{
    deleteWindow.close();  
    console.log(id +": deleted");
  readDB();
  })

});

ipcMain.on('item:edit',function(e, id){

  var studentToUpdate= knex.select("studentId","name","email","phone","address","tuition","year",).from("studentTable").where({"studentId" : id})
  studentToUpdate.then(function(rows){
    editWindow.webContents.send('item:editItem',rows);
  })
  
})

ipcMain.on('item:editDone', function(e, id,name,email,phone,address,tuition,year) {
  knex("studentTable").where({"studentId" : id}).update({
    name:name,email:email,phone:phone,address:address,tuition:tuition,year:year
  })
  .then(() => console.log(name +": data updated"))
  .catch(err =>{}) 
  .then(() =>{
    editWindow.close();
    clearWindow();
    readDB();
  })  

});


function clearWindow()
{
    mainWindow.webContents.send('item:clear');
}//end function clearWindow

function readDB()
{
  clearWindow()
  let result = knex.select("studentId","name","email","phone","address","tuition","year").from("studentTable")
  result.then(function(rows){
      mainWindow.webContents.send('item:add',rows);
  })

}//end function readDB

//template for menu
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      { label: 'Add', click() {createAddWindow()}},
      {label: 'Read',click(){readDB()}},
      {label: 'Edit',click(){createEditWindow()}},
      {label: 'Delete',click(){createDeleteWindow()}},
      {label: 'Clear',click(){clearWindow()}},
      {label: 'Quit',accelerator:'CmdOrCtrl + q',click(){app.quit()}}
    ]
  }
];

app.on('ready', createWindow)



