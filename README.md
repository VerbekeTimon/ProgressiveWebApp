# Progressive Web Apps

## 1. Git repo
url: [https://github.com/VerbekeTimon/ProgressiveWebApp](https://github.com/VerbekeTimon/ProgressiveWebApp)

## 2. App
This app is called Expense Manager. Reading the name you can already guess what the app is supposed to do. You can add expenses, you can see all your expenses you have done, edit an expense in history (misspelled / wrong date / wrong price) page, delete a certain expence or clear all history.
See a graph what categories you spend most you money on.
Last but not least you can also see your transaction in wallet page. By putting your total amount of money you have and your income, each month it increases with your income and all transaction are subtracted.

![](https://i.imgur.com/lJ6ywx2.png)

## 3. Hosted
My app is hosted with firebase.

url: [https://expensemanager-9fb05.firebaseapp.com/](https://expensemanager-9fb05.firebaseapp.com/)

## 4. Security headers
For implemening security headers I used Helmet. As you can see in the code below, I implemented the following headers:
* X-XSS-Protection
* Referrer-Policy
* X-Frame-Options
* Content-Secutiry-Policy
  * default-src
  * script-src
  * img-src & style-src
  * connect-src
  * report-uri (/report-violation)
* Strict-Transport-Security (1 year)

```javascript
let helmet = require('helmet');

// app.use(helmet());
app.use(helmet.xssFilter());
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.contentSecurityPolicy({
    directives: {
        ...
    }
}));
app.use(helmet.hsts({
    maxAge: 31536000
}));
```

The problem with these headers is that firebase doesn't support all headers. HSTS, CSP and referrer-policy are only working with localhost:3000.

## 5. Webpack
