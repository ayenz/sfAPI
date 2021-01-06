const mongoose = require("mongoose");
const GajiPegawaiSchema = new mongoose.Schema({
    _id: {
        type: String,
        require: true,
    },
    nama: {
        type: String,
        require: true,
    },
    potongan: {
        type: Number,
        require: true,
    },
    totalHariKerja: {
        type: Number,
        require: true,
    },
    gaji: {
        type: Number,
        default: 0,
    }
});

const GajiSchema = mongoose.Schema({
    tanggal: {
        type: Date,
        default: Date.now,
    },
    pegawai: [GajiPegawaiSchema],
    totalPembayaranGaji: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model("Gaji", GajiSchema);
