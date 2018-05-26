document.addEventListener("DOMContentLoaded", function (event) {

    $(".mainMenu button:nth-of-type(1)").on('click', showAddPage);
    $(".mainMenu button:nth-of-type(2)").on('click', showWalletPage);
    $(".mainMenu button:nth-of-type(3)").on('click', showChartPage);
    $(".mainMenu button:nth-of-type(4)").on('click', showHistoryPage);
    $(".mainMenu button:nth-of-type(5)").on('click', showAboutPage);
    // $(".mainMenu button:nth-of-type(6)").on('click', showSettingsPage);

    $("#goHome").on('click', showHomePage);

    createIndexedDB();
});

window.indexed = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

if(!window.indexedDB) {
    alert("indexedDB not working...");
}

if('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js', { scope: './'})
        .then(function (registration) {
            console.log("Service Worker Registered");
        })
        .catch(function (err) {
            console.log("Service Worker Failed to Register", err);
        })
}

function createIndexedDB() {
    // Open Database
    let requestuest = window.indexedDB.open("expensemanager", 1);

    // On Upgrade
    requestuest.onupgradeneeded = function (e) {
        let db = e.target.result;

        if (!db.objectStoreNames.contains("expenses")) {
            let os = db.createObjectStore("expenses", {keyPath: "Id", autoIncrement: true});
            // Create index for product
            os.createIndex('product', 'product', {unique: false});
        }
        if (!db.objectStoreNames.contains("wallet")) {
            let os = db.createObjectStore("wallet", {keyPath: "Id", autoIncrement: true});
            // Create index for product
            os.createIndex('wallet', 'income', {unique: false});
        }
    };

    // On success
    requestuest.onsuccess = function (e) {
        console.log("Success: Openend Database...");
        db = e.target.result;
        // Show expenses
        showExpenses();
        showWallet();
    };

    // On Error
    requestuest.onerror = function (e) {
        console.log("Error: Could Not Open Database...");
    };
}

// Add Expenses
function addExpenses() {
    let product = $("#product").val();
    let price = $("#amount").val();
    let date = $("#date").val();
    let category = $("#category").val();

    let transaction = db.transaction(["expenses"], "readwrite");
    // Ask for ObjectStore
    let store = transaction.objectStore("expenses");

    // Define expense
    let expense = {
        product: product,
        price: price,
        date: date,
        category: category
    };

    // Perform add
    let request = store.add(expense);

    // On Success
    request.onsuccess = function (e) {
        window.location.href="index.html";
    };

    // On Error
    request.onerror = function (e) {
        console.log("Error:" + e.target.error.name);
    };
}

// Display Expenses
function showExpenses() {
    let transaction = db.transaction(["expenses"], "readonly");
    // Ask for ObjectStore
    let store = transaction.objectStore("expenses");
    let index = store.index('product');
    let output = '';
    index.openCursor().onsuccess = function (e) {
        let cursor = e.target.result;
        if (cursor) {
            output += "<tr class='expense_" + cursor.value.id + "'>";
            output += "<td><span class='cursor expense' contenteditable='true' data-field='product' data-id='" + cursor.value.Id + "'>" + cursor.value.product + "</td>";
            output += "<td><span class='cursor expense' contenteditable='true' data-field='price' data-id='" + cursor.value.Id + "'>€ " + cursor.value.price + "</td>";
            output += "<td><span class='cursor expense' contenteditable='true' data-field='date' data-id='" + cursor.value.Id + "'>" + cursor.value.date + "</td>";
            output += "<td><a onclick='deleteExpense(" + cursor.value.Id + ")' href=''><img alt=\"delete\" src=\"images/delete.png\" width=\"25\" height=\"25\"/></a></td>";
            output += "</tr>";
            cursor.continue();
        }
        $("#productValue").html(output).sort();
    };
}

// Clear all expenses from database
function clearHistory() {
    let transaction = db.transaction(["expenses"], "readwrite");

    // create an object store on the transaction
    let objectStore = transaction.objectStore("expenses");

    // Make a request to clear all the data out of the object store
    let objectStoreRequest = objectStore.clear();

    objectStoreRequest.onsuccess = function() {
        // report the success of our request
        alertify.success("Successfully Cleared History");
        showExpenses();
    };
}

// Delete expense
function deleteExpense(id) {
    let transaction = db.transaction(["expenses"], "readwrite");

    // create an object store on the transaction
    let objectStore = transaction.objectStore("expenses");

    let request = objectStore.delete(id);

    // On Success
    request.onsuccess = function () {
        console.log("Expense " + id + " Deleted");
        $(".expense_" + id).remove();
        showExpenses();
    };

    // On Error
    request.onerror = function (e) {
        alert("Sorry, Could not delete expense");
        console.log("Error:" + e.target.error.name);
    };
}

// Update expenses
$('.expensetable').on('blur','.expense',function () {
    // Newly entered  text
    let newText = $(this).html();
    // Field
    let field = $(this).data('field');
    // Expense ID
    let id = $(this).data('id');

    // Get transaction
    let transaction = db.transaction(["expenses"], "readwrite");
    // Ask for ObjectStore
    let store = transaction.objectStore("expenses");

    let requestuest = store.get(id);

    requestuest.onsuccess = function () {
        let data = requestuest.result;
        if (field === 'product') {
            data.product = newText;
        } else if (field === 'price') {
            data.price = newText;
        }

        // Store Updatad Text
        let requestuestUpdate = store.put(data);
        requestuestUpdate.onsuccess = function () {
            console.log("Expense Field Updated...");
        };

        requestuestUpdate.onerror = function () {
            console.log("Expense Field Not Updated...");
        };
    }
});

// add to wallet
function addWallet() {
    let total = $("#balance").val();
    let income = $("#income").val();

    let transaction = db.transaction(["wallet"], "readwrite");
    // Ask for ObjectStore
    let store = transaction.objectStore("wallet");

    // Define expense
    let wallet = {
        total: total,
        income: income
    };

    // Perform add
    let requestuest = store.add(wallet);

    // On Success
    requestuest.onsuccess = function (e) {
        window.location.href="index.html";
    };

    // On Error
    requestuest.onerror = function (e) {
        alert("Sorry, The form was not submitted");
        console.log("Error:" + e.target.error.name);
    };
}

// show wallet
function showWallet() {
    let transaction = db.transaction(["wallet"], "readonly");
    // Ask for ObjectStore
    let store = transaction.objectStore("wallet");
    let index = store.index('wallet');
    let output = '';
    index.openCursor().onsuccess = function (e) {
        let cursor = e.target.result;
        if (cursor) {
            output += "<tr>";
            output += "<td><span class='cursor expense' contenteditable='true' data-field='income' data-id='" + cursor.value.Id + "'>€ " + (cursor.value.total) + "</td>";
            output += "<td><span class='cursor expense' contenteditable='true' data-field='income' data-id='" + cursor.value.Id + "'>€ " + cursor.value.income + "</td>";
            output += "</tr>";
            cursor.continue();
        }
        $("#wallet").html(output).sort();
    };
}

function showAddPage() {
    $(".mainMenu").hide();
    $(".showHistoryPage").hide();
    $(".showAboutPage").hide();
    $(".showSettingsPage").hide();
    $(".showChartPage").hide();
    $(".showWalletPage").hide();
    $(".addExpensePage").show();
    document.getElementById("h").innerHTML = "Add Expense";
}

function showHomePage() {
    $(".mainMenu").show();
    $(".showChartPage").hide();
    $(".addExpensePage").hide();
    $(".showHistoryPage").hide();
    $(".showAboutPage").hide();
    $(".showSettingsPage").hide();
    $(".showWalletPage").hide();
    document.getElementById("h").innerHTML = "Expense Manager";
}

function showHistoryPage() {
    $(".mainMenu").hide();
    $(".addExpensePage").hide();
    $(".showAboutPage").hide();
    $(".showSettingsPage").hide();
    $(".showChartPage").hide();
    $(".showWalletPage").hide();
    $(".showHistoryPage").show();
    document.getElementById("h").innerHTML = "History";
}

function showAboutPage() {
    $(".mainMenu").hide();
    $(".addExpensePage").hide();
    $(".showHistoryPage").hide();
    $(".showSettingsPage").hide();
    $(".showChartPage").hide();
    $(".showWalletPage").hide();
    $(".showAboutPage").show();
    document.getElementById("h").innerHTML = "About";
}

function showChartPage() {
    $(".mainMenu").hide();
    $(".addExpensePage").hide();
    $(".showHistoryPage").hide();
    $(".showSettingsPage").hide();
    $(".showAboutPage").hide();
    $(".showWalletPage").hide();
    $(".showChartPage").show();
    document.getElementById("h").innerHTML = "Chart";
}

function showWalletPage() {
    $(".mainMenu").hide();
    $(".addExpensePage").hide();
    $(".showHistoryPage").hide();
    $(".showSettingsPage").hide();
    $(".showAboutPage").hide();
    $(".showChartPage").hide();
    $(".showWalletPage").show();
    document.getElementById("h").innerHTML = "Wallet";
}

// function showSettingsPage() {
//     $(".mainMenu").hide();
//     $(".addExpensePage").hide();
//     $(".showHistoryPage").hide();
//     $(".showAboutPage").hide();
//     $(".showSettingsPage").show();
//     document.getElementById("h").innerHTML = "Settings";
// }

