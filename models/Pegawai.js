const mongoose = require("mongoose");
const PegawaiSchema = mongoose.Schema({
    nama: {
        type: String,
        require: true,
    },
    telp: {
        type: String,
        require: true,
    },
    gaji: {
        type: Number,
        require: true,
    },
    status: {
        type: Boolean,
        require: true,
    },
    totalHariKerja: {
        type: Number,
        default: 0,
    },
    jumlahBon: {
        type: Number,
        default: 0,
    },
    tanggalDitambahkan: {
        type: Date,
        default: Date.now,
    },
    tanggalDiubah: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Pegawai", PegawaiSchema);
