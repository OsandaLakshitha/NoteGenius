const express = require('express');
const {
    createFolder,
    getFolders,
    getFolderById,
    updateFolder,
    deleteFolder
} = require('../controllers/folderController');

const router = express.Router();

router.post('/create-folder',createFolder);
router.get('/',getFolders);
router.get('/:id',getFolderById);
router.put('/:id',updateFolder);
router.delete('/:id',deleteFolder);

module.exports = router;