const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

// Soporte para archivos estáticos tanto en la raíz como en carpeta 'public'
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

// Puerto dinámico asignado por Railway o 3000 local
const PORT = process.env.PORT || 3000;

// Configuración con soporte para Railway y Localhost
const db = mysql.createConnection({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'mi_proyecto_db',
    port: process.env.MYSQLPORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
        return;
    }
    console.log('Conectado exitosamente a la base de datos MySQL.');
});

// Ruta para guardar registros/logins directamente en MySQL
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'INSERT INTO usuarios (email, password_hash) VALUES (?, ?)';
    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error('Error al guardar en MySQL:', err);
            return res.status(500).send('Error interno');
        }
        res.status(200).send('OK');
    });
});

app.post('/registro', (req, res) => {
    const { email, password } = req.body;

    const query = 'INSERT INTO usuarios (email, password_hash) VALUES (?, ?)';
    db.query(query, [email, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send('El correo ya está registrado.');
            }
            return res.status(500).send('Error al guardar en la base de datos.');
        }
        res.status(200).send('Usuario registrado con éxito.');
    });
});

app.listen(PORT, () => console.log(`Servidor activo en el puerto ${PORT}`));