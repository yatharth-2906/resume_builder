const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
    template_folder: {
        type: String,
        required: true,
        unique: true,
    },
    resume1:{
        type: String,
        default: null,
    },
    resume2: {
        type: String,
        default: null,
    },
    resume3: {
        type: String,
        default: null,
    },
    resume4: {
        type: String,
        default: null,
    },
    resume5: {
        type: String,
        default: null,
    },
    resume6: {
        type: String,
        default: null,
    }
});

const Version = mongoose.model('File', versionSchema);

module.exports = Version;
