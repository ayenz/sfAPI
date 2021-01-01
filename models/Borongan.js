const mongoose = require("mongoose");
const PembayaranSchema = new mongoose.Schema({
    nilaiPembayaran: {
        type: Number,
        require: true,
    },
    tanggalPembayaran: {
        type: Date,
        require: true,
    }
});

const BoronganSchema = mongoose.Schema({
    nama: {
        type: String,
        require: true,
    },
    telp: {
        type: String,
        require: true,
    },
    layanan: {
        type: Array
    },
    nilaiBorongan: {
        type: Number,
        require: true,
    },
    statusBorongan: {
        type: Boolean,
        default: true,
    },
    pembayaran: [PembayaranSchema],
    belumDibayar: {
        type: Number
    },
    tanggalDitambahkan: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Borongan", BoronganSchema);
