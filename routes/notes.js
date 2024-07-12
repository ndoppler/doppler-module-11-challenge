const notes = require('express').Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a tip`);

    const { title, text} = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`Note added successfully!`);
    } else {
        res.error('Error in adding notes');
    }
});

notes.delete('/:id', (req, res) => {
    console.info(`${req.method} request received to delete a note`);
    const noteId = req.params.id;

    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((notes) => {
            const updatedNotes = notes.filter((note) => note.id !== noteId);
            writeToFile('./db/db.json', updatedNotes);
            res.json(`Note with ID: ${noteId} deleted successfully!`);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json('Error in deleting note');
        });
});

module.exports = notes;