import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-database.js";

//firebase variables
const appSettings = {
    databaseURL: "https://shoppingcart-bc46a-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)

const database = getDatabase(app)

const productsInDB = ref(database, "products")

//html elements variables
const productInput = document.querySelector('#productInput');
const submitBtn = document.querySelector('#submitBtn');

const shoppingList = document.querySelector('#shoppingList');

//fetching values
onValue(productsInDB, function(snapshot){    
    //check if there is a item in database
    if(snapshot.exists()){
        let productsArray = Object.entries(snapshot.val());
        clearShoppingListEl();
        for(let i = 0; i < productsArray.length; i++){
            let currentProduct = productsArray[i];
            let currentProductID = currentProduct[0];
            let currentProductValue = currentProduct[1];
            
            addToShoppingListEl(currentProduct)
        };
    }else{
        shoppingList.innerHTML = 'No items here... yet';
    }
});


submitBtn.addEventListener('click', () =>{
    let inputValue = productInput.value

    
    //pushing inputValue to database
    if(inputValue != "")
        push(productsInDB, inputValue)
    
    clearProductInput()
    
})

function clearProductInput() {
    productInput.value = "";
    
};

function addToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement('li')

    newEl.textContent = itemValue;

    shoppingList.append(newEl);

    newEl.addEventListener('click', () =>{
        let itemLocationDB = ref(database, `products/${itemID}`)
        remove(itemLocationDB)
    });
}

function clearShoppingListEl() {
    shoppingList.innerHTML = ""
}
