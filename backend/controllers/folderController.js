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
        const {name,color} = req.body;

        //Validate name
        const existingFolder = await Folder.findOne({name});
        if(existingFolder){
            return res.status(400).json({error: 'Folder name already exists. Choose different name '});
        }

        //validate color 
        if(color && !predefinedColors.includes(color)) {
            return res.status(400).json({error: 'Invalid color Selection'});
        }

        const updatedFolder = await Folder.findByIdAndUpdate(
            req.params.id,
            {name, color},
            {new: true,runValidators:true}
        );

        if (!updatedFolder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

    res.status(200).json(updatedFolder);
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
