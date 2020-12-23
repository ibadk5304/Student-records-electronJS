function submitForm(e) {
    e.preventDefault();
    const errors = submitErrors()
    if(errors.length === 0){
     const wine = 
     {
       "name": document.querySelector('#name').value,
       "category": document.querySelector('#category').value,
       "type": document.querySelector('#type').value,
       "year": document.querySelector('#year').value,
       "rating": document.querySelector('#rating').value
     }
     ipcRenderer.send('item:add', wine);//send to main.js
   }
   else{
     clearErrors()
     errors.forEach(error =>{
       const key = Object.keys(error)[0]
       document.getElementById(key).innerText = error[key]
     })
   }
 
  }
 
  function sliderChange(){
    sliderValue.innerText = document.querySelector("#rating").value
  }
  
  function categoryChange(){
    let category = document.querySelector('#category').value;
    let typeSelect = document.querySelector('#type')
    typeSelect.innerHTML = "";
    let types;
    if(category.toUpperCase() === "RED"){
      types = redTypes
    }
    if(category.toUpperCase() === "WHITE"){
      types = whiteTypes
    }
    if(category.toUpperCase() === "DESSERT"){
      types = dessertTypes
    }
    types.forEach( type =>{
      let typeNode = document.createElement('option')
      typeNode.appendChild(document.createTextNode(type));
      typeNode.value = type;
      typeSelect.appendChild(typeNode)
    })
  }
  categoryChange();
  
  function submitErrors(){
    let errors = []
    const regex = /^\d{4}$/
    const year = document.querySelector('#year').value
    const isYear= regex.test(year)
    if(!isYear){
       errors.push({"yearError": "*Please input a correct year format ####"})
    }
 
    const name = document.getElementById('name').value
    if(!name){
       errors.push({"nameError": "*Please input a name"})
    }
    return errors
  }
 
  function clearErrors(){
    const errorIDS = ["nameError", "yearError"]
 
    errorIDS.forEach(id => {
      document.getElementById(id).innerText = ""
    })
  }
 