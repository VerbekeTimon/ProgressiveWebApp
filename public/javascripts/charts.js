new Chartist.Bar('.ct-chart', {
    labels: ['Electr.', 'Clothes', 'Food', 'Games', 'Other'],
    series: [
        [259.00, 149.99, 19.99, 43.00, 9.99],
        // [155.00, 0, 32.00, 0, 0],
        // [47.99, 0, 26.20, 3.5, 9.98]
    ]
}, {
    width: 360,
    height: 500
});

// let request = window.indexedDB.open("expensemanager", 1);
//
// request.then(function(db) {
//     var tx = db.transaction('store', 'readonly');
//     var store = tx.objectStore('store');
//     return store.getAll();
// }).then(function(items) {
//     console.log('Items by name:', items);
// });

// fetch('remote/data.json').then(function(response) {
//     return response.json();
// }).then(function(data) {
//     new Chartist.Line('#chart', data);
// });