const express = require('express');
const {
    createFolder,
    getFolders,
    getFolderById,
    updateFolder,
    deleteFolder,
    addNoteToFolder,
    getNotesInFolder,
    removeNoteFromFolder
} = require('../controllers/folderController');

const router = express.Router();

router.post('/create-folder',createFolder);
router.get('/',getFolders);
router.get('/:id',getFolderById);
router.put('/:id',updateFolder);
router.delete('/:id',deleteFolder);
router.post('/:id/add-note', addNoteToFolder);
router.get('/:id/notes', getNotesInFolder);
router.delete('/:id/remove-note/:noteId', removeNoteFromFolder);

module.exports = router;