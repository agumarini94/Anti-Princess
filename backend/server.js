import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import client from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3005;
const JWT_SECRET = "mi_clave_secreta_anti_princess";

// --- 1. RUTA DE REGISTRO ---
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email';
        const result = await client.query(query, [username, email, hashedPassword]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') { // Código de error de Postgres para "llave duplicada"
            return res.status(400).json({ error: "E-mail or Username already exists" });
        }
        res.status(500).json({ error: "Could not register user" });
    }
});

// --- 2. RUTA DE LOGIN ---
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '2h' });
            res.json({
                message: "Welcome!",
                token,
                user: { id: user.id, username: user.username }
            });
        } else {
            res.status(401).json({ error: "Credenciales incorrectas" });
        }
    } catch (err) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// --- 3. RUTA DE TAREAS (GLOBALES + PRIVADAS) ---
app.get('/tasks/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Trae las tareas del usuario logueado O las tareas fijas (user_id IS NULL)
        const query = `
            SELECT * FROM tasks 
            WHERE user_id = $1 OR user_id IS NULL 
            ORDER BY id ASC
        `;
        const result = await client.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener tareas" });
    }
});

// --- 4. RUTA PARA GUARDAR TAREA PRIVADA ---
app.post('/tasks', async (req, res) => {
    const { text, completed, userId } = req.body;
    try {
        const query = 'INSERT INTO tasks (text, completed, user_id) VALUES ($1, $2, $3) RETURNING *';
        const result = await client.query(query, [text, completed || false, userId]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'No se pudo guardar la tarea' });
    }
});

// ESTA SECCION ES PARA CREAR DESAFIOS EN GRUPO EN LA APP  <------ 

// STEP 1  GENERAR UN CODIGO ALEATORIO DE 6 CARACTERESPARA UNIRME A UN GRUPO 
const generateJoinCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();
app.post('/challenges', async (req, res) => { //paso los datos post a la bd 
    const { name, description, princess, days, money, winners, creator_id } = req.body;
    const join_code = generateJoinCode();
    try {
        // 1. Insertar el desafío, dentro de la tabla challenges, values(x , x , ...)
        //Mando $1, $2,, por seguridad ,para evitar que alguien acceda a la bd usando un codigo js como valor. 
        const challengeQuery = `
            INSERT INTO challenges (name, description, princess, days, money, winners, creator_id, join_code)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
        const newChallenge = await client.query(challengeQuery, [name, description, princess, days, money, winners, creator_id, join_code]);

        const challengeId = newChallenge.rows[0].id;

        // 2. Unir automáticamente al creador en la tabla user_challenges
        await client.query(
            'INSERT INTO user_challenges (user_id, challenge_id) VALUES ($1, $2)',
            [creator_id, challengeId]
        );

        res.status(201).json(newChallenge.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al crear el desafío" });
    }
});

//Estructura que uso para unirme con el boton Unirme A Un Grupo <---* 
app.post('/challenges/join', async (req, res) => {
    const { user_id, join_code } = req.body;
    try {
        // 1. Buscar si el código existe
        const challengeSearch = await client.query(
            'SELECT id FROM challenges WHERE join_code = $1',
            [join_code]
        );
        if (challengeSearch.rows.length === 0) {
            return res.status(404).json({ error: "Código no encontrado" });
        }
        const challenge_id = challengeSearch.rows[0].id;
        // 2. Insertar en la tabla de vínculo
        await client.query(
            'INSERT INTO user_challenges (user_id, challenge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [user_id, challenge_id]
        );

        res.json({ message: "¡Te has unido con éxito!", challenge_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "No pudiste unirte al desafío" });
    }
});

//---> ESTA SECCION ES PARA VER LOS DESAFIOS EN LOS CUALES CADA USER ESTA UNIDO <---**
app.get('/my-challenges/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const query = `
            SELECT c.* FROM challenges c
            JOIN user_challenges uc ON c.id = uc.challenge_id
            WHERE uc.user_id = $1
            ORDER BY c.created_at DESC`;
        const result = await client.query(query, [userId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Not possible get your challenges" });
    }
});

// SECCION PARA OBTENER LA RUTA DE LOS PARTICIPANTES QUE ESTAN PARTICIPANDO EN EL DESAFIO 
app.get('/challenge-players/:challengeId', async (req, res) => {
    const { challengeId } = req.params;
    try {
        const query = `
            SELECT u.username, uc.is_eliminated, 
            (SELECT COUNT(*) FROM challenge_submissions cs WHERE cs.user_id = u.id AND cs.challenge_id = $1) as points
            FROM users u
            JOIN user_challenges uc ON u.id = uc.user_id
            WHERE uc.challenge_id = $1`;
        const result = await client.query(query, [challengeId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener participantes" });
    }
});

app.post('/submit-proof', async (req, res) => {
    const { challenge_id, user_id } = req.body;
    try {
        // Insertamos el punto (si ya existe por hoy, el UNIQUE de la DB dará error)
        await client.query(
            'INSERT INTO challenge_submissions (challenge_id, user_id) VALUES ($1, $2)',
            [challenge_id, user_id]
        );
        res.json({ message: "Punto sumado con éxito" });
    } catch (err) {
        if (err.code === '23505') { // Error de duplicado en Postgres
            res.status(400).json({ error: "Ya subiste tu prueba por hoy" });
        } else {
            res.status(500).json({ error: "Error al guardar el progreso" });
        }
    }
});


// --- ESCUCHA DEL SERVIDOR ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server Anti-Princess corriendo en http://localhost:${PORT}`);
});