const express = require('express');
const router = express.Router();
const connection = require('../db');

// Get all todos, rewards, and requirements
router.post('/api', (req, res) => {
    const { user_id } = req.body;

    connection.query(`
        SELECT * FROM todos WHERE user_id = ? ORDER BY completed;
        SELECT * FROM rewards WHERE user_id = ?;
        SELECT q.reward_id AS reward_id, q.todo_id AS todo_id, t.text as text, t.completed AS completed FROM requirements q LEFT JOIN todos t ON q.todo_id = t.todo_id WHERE t.user_id = ?;
        SELECT color_theme FROM SETTINGS WHERE user_id = ?;
    `, [user_id, user_id, user_id, user_id], (err, results) => {
        if (!err) {
            res.json(results);
        } else {
            console.log(err);
        }
    });
});

// Get requirements and todos
router.post('/api/get-requirements-and-todos', (req, res) => {
    const { reward_id, user_id } = req.body;

    connection.query(`
        SELECT *
        FROM (
            SELECT
                t.todo_id AS todo_id,
                t.text AS text,
                q.reward_id AS reward_id,
                t.completed AS completed,
                t.user_id AS user_id
            FROM todos t
            LEFT JOIN requirements q
            ON t.todo_id = q.todo_id
            WHERE q.reward_id = ? AND t.user_id = ?
            GROUP BY todo_id

            UNION
            
            SELECT
                t.todo_id AS todo_id,
                t.text AS text,
                q.reward_id AS reward_id,
                t.completed AS completed,
                t.user_id AS user_id
            FROM todos t
            LEFT JOIN requirements q
            ON t.todo_id = q.todo_id
            WHERE (q.reward_id <> ? OR q.reward_id IS NULL) AND t.user_id = ?
            GROUP BY todo_id
        ) AS a
        GROUP BY todo_id
        ORDER BY completed;
    `, [reward_id, user_id, reward_id, user_id], (err, results) => {
        if (!err) {
            res.json(results);
        } else {
            console.log(err);
        }
    });
});

module.exports = router;