const Folder = require('../models/Folder');
const predefinedColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

//Create folder
const createFolder = async (req, res) => {
    try {

        const{name,color} = req.body;

        //validate color 
        if(color && !predefinedColors.includes(color)) {
            return res.status(400).json({error: 'Invalid color Selection'});
        }

        //check existing folder for prevent duplication
        const existingFolder = await Folder.findOne({name});
        if(existingFolder){
            return res.status(400).json({error: 'Folder name already exists. Choose different name '});
        }

        const newFolder = new Folder({name,color});
        await newFolder.save();
        res.status(200).json(newFolder);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

//Get All folders
const getFolders = async (req,res) => {
    try {
        const folders = await Folder.find();
        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get folder by ID
const getFolderById = async (req,res) => {
    try {
        const folder = await Folder.findById(req.params.id);
        if(!folder){
            return res.status(404).json({error:'Folder not found'});
        }
        res.status(200).json(folder);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

//Update Folder (color,name)
const updateFolder = async (req,res) => {
    try {
        const { id } = req.params; // Folder ID from URL
    const { name, color } = req.body;

    // Check if folder exists
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Validate name (Ensure it's unique, excluding the current folder)
    const existingFolder = await Folder.findOne({ name, _id: { $ne: id } });
    if (existingFolder) {
      return res.status(400).json({ error: 'Folder name already exists. Choose a different name.' });
    }

    // Update folder
    folder.name = name || folder.name;
    folder.color = color || folder.color;
    await folder.save();

    res.status(200).json({ message: 'Folder updated successfully', folder });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Delete Folder
const deleteFolder = async (req,res) => {
    try {
        const deletedFolder = await Folder.findByIdAndDelete(req.params.id);
        if(!deleteFolder) {
            return res.status(404).json({error:'Folder not Found'});
        }
        res.status(200).json({message:'Folder Deleted Successfully'});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};

module.exports = {
    createFolder,
    getFolders,
    getFolderById,
    updateFolder,
    deleteFolder
}
