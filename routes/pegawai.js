const express = require("express");
const router = express.Router();
const Pegawai = require("../models/Pegawai");

//GET ALL PEGAWAI
router.get("/", async (req, res) => {
    try {
        const pegawai = await Pegawai.find();
        res.json(pegawai);
    } catch (error) {
        res.json({ error: true, message: error });
    }
});

//ADD PEGAWAI
router.post("/add", async (req, res) => {
    const pegawai = new Pegawai({
        nama: req.body.nama,
        telp: req.body.telp,
        gaji: req.body.gaji,
    });
    try {
        const savedPost = await pegawai.save();
        res.json(savedPost);
    } catch (error) {
        res.json({ error: true, message: error });
    }
});

//GET PEGAWAI BY ID
router.get("/:pegawaiId", async (req, res) => {
    try {
        const pegawai = await Pegawai.findById(req.params.pegawaiId);
        res.json(pegawai);
    } catch (error) {
        res.json({ error: true, message: error });
    }
});

//DELETE PEGAWAI BY ID
router.delete("/:pegawaiId", async (req, res) => {
    try {
        const pegawai = await Pegawai.deleteOne({ _id: req.params.pegawaiId });
        res.json(pegawai);
    } catch (error) {
        res.json({ error: true, message: error });
    }
});

//UDPATE ATTRIBUTE BY ID
router.patch("/:pegawaiId", async (req, res) => {
    try {
        const pegawaiOldData = await Pegawai.findById(req.params.pegawaiId);
        const nama = (req.body.nama == null) ? pegawaiOldData.nama : req.body.nama;
        const telp = (req.body.telp == null) ? pegawaiOldData.telp : req.body.telp;
        const gaji = (req.body.gaji == null) ? pegawaiOldData.gaji : req.body.gaji;
        const status = (req.body.status == null) ? pegawaiOldData.status : req.body.status;
        const totalHariKerja = (req.body.totalHariKerja == null) ? pegawaiOldData.totalHariKerja : req.body.totalHariKerja;
        const jumlahBon = (req.body.jumlahBon == null) ? pegawaiOldData.jumlahBon : req.body.namjumlahBon;

        const pegawai = await Pegawai.updateOne(
            { _id: req.params.pegawaiId },
            {
                $set: {
                    nama: nama,
                    telp: telp,
                    gaji: gaji,
                    totalHariKerja: totalHariKerja,
                    jumlahBon: jumlahBon,
                    status: status,
                    tanggalDiubah: Date.now()
                }
            },
            { upsert: true }
        );
        res.json(pegawai);
    } catch (error) {
        res.json({ error: true, message: error });
    }
});

module.exports = router;
