import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


// database URL
const appSettings = {
    databaseURL: "https://endorsement-db-f4059-default-rtdb.europe-west1.firebasedatabase.app"
}


// setting connection to firebase
const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementInDB = ref(database, "endorsements")


// initialize variables 
const endorseFieldEl = document.getElementById("endorse-el")
const publishBtnEl = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("endorsement-list")
const senderEl = document.getElementById("sender-el")
const receiverEl = document.getElementById("receiver-el")



publishBtnEl.addEventListener("click", function() {
// Initializing object
    const endorserInfo = {
        From: senderEl.value,
        To: receiverEl.value,
        Message: endorseFieldEl.value
    }

    // Insert object into the database
    push(endorsementInDB, endorserInfo)
        
   // clear field input
    clearInputField()
   
})

// importing from database
onValue(endorsementInDB, function(snapshot) {
    // checks if database is not null
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        let reversedArray = itemsArray.reverse()
        clearEndorsementsList() 

        // loop to display data in a reversed manner
        for (let i = 0; i < reversedArray.length; i++) {
            let currentItem = reversedArray[i]
            displayEndorsements(currentItem)
        }
    } else {
        endorsementListEl.innerHTML = `<p> There are no endorsements yet! </p>`
    }
    
       
})


// clear endorsement list
function clearEndorsementsList() {
    endorsementListEl.innerHTML = ""

}


// clear field input
function clearInputField() {
    endorseFieldEl.value = ""
    senderEl.value = ""
    receiverEl.value= ""
}



function displayEndorsements(item) {
   let itemID = item[0]
   let itemValue = item[1]
   let itemFrom = itemValue["From"]
   let itemTo = itemValue["To"]
   let itemMessage = itemValue["Message"]
 
   let itemList = document.createElement("li")
   itemList.innerHTML = `<span>From ${itemFrom} </span> ${itemMessage} <span>To ${itemTo}</span>` 
   


   endorsementListEl.append(itemList)
   
   itemList.addEventListener("dblclick", function(){
    let locationOfItemInDB = ref(database, `endorsements/${itemID}`)
   
     remove(locationOfItemInDB)
    })

}


    
