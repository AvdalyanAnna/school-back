const mysql = require('mysql');

// Подключение к базе данных
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'school'
});

// Проверка подключения
connection.connect((err) => {
    if (err) {
        console.error('Ошибка подключения: ' + err.stack);
        return;
    }

    console.log('Успешное подключение к базе данных MySQL.');
});

module.exports = connection;
