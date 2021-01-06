const express = require("express");
const router = express.Router();
const Pegawai = require("../models/Pegawai");
require("dotenv/config");

const SECRET = process.env.SECRET;

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
    if (req.body.secret != SECRET || req.body.secret == null) {
        res.json({ error: true, message: 'Wrong secret' });
    }
    else {
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
    }
});

//GET PEGAWAI BY ID
router.get("/get/:pegawaiId", async (req, res) => {
    try {
        const pegawai = await Pegawai.findById(req.params.pegawaiId);
        res.json(pegawai);
    } catch (error) {
        res.json({ error: true, message: error });
    }
});

//DELETE PEGAWAI BY ID
router.delete("/delete", async (req, res) => {
    if (req.body.secret != SECRET || req.body.secret == null) {
        res.json({ error: true, message: 'Wrong secret' });
    } else {
        try {
            const pegawai = await Pegawai.deleteOne({ _id: req.body.id });
            res.json(pegawai);
        } catch (error) {
            res.json({ error: true, message: error });
        }
    }
});

//UDPATE ATTRIBUTE BY ID
router.patch("/update", async (req, res) => {
    if (req.body.secret != SECRET || req.body.secret == null) {
        res.json({ error: true, message: 'Wrong secret' });
    } else {
        try {
            const pegawaiOldData = await Pegawai.findById(req.body.id);
            const nama = (req.body.nama == null) ? pegawaiOldData.nama : req.body.nama;
            const telp = (req.body.telp == null) ? pegawaiOldData.telp : req.body.telp;
            const gaji = (req.body.gaji == null) ? pegawaiOldData.gaji : req.body.gaji;
            const status = (req.body.status == null) ? pegawaiOldData.status : req.body.status;
            const totalHariKerja = (req.body.totalHariKerja == null) ? pegawaiOldData.totalHariKerja : req.body.totalHariKerja;
            const jumlahBon = (req.body.jumlahBon == null) ? pegawaiOldData.jumlahBon : req.body.jumlahBon;
            const cicilanBon = (req.body.cicilanBon == null) ? pegawaiOldData.cicilanBon : req.body.cicilanBon;

            const pegawai = await Pegawai.updateOne(
                { _id: req.body.id },
                {
                    $set: {
                        nama: nama,
                        telp: telp,
                        gaji: gaji,
                        totalHariKerja: totalHariKerja,
                        jumlahBon: jumlahBon,
                        cicilanBon: cicilanBon,
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
    }
});

//UDPATE ATTRIBUTE ABSEN BY ID
router.patch("/absen", async (req, res) => {
    if (req.body.secret != SECRET || req.body.secret == null) {
        res.json({ error: true, message: 'Wrong secret' });
    } else {
        try {
            const pegawaiOldData = await Pegawai.findById(req.body.id);
            const totalHariKerja = pegawaiOldData.totalHariKerja + 1;
            const jumlahBon = (req.body.jumlahBon == null) ? pegawaiOldData.jumlahBon : req.body.jumlahBon;
            const cicilanBon = (req.body.cicilanBon == null) ? pegawaiOldData.cicilanBon : req.body.cicilanBon;

            const pegawai = await Pegawai.updateOne(
                { _id: req.body.id },
                {
                    $set: {
                        totalHariKerja: totalHariKerja,
                        jumlahBon: jumlahBon,
                        cicilanBon: cicilanBon,
                        tanggalDiubah: Date.now()
                    }
                },
                { upsert: true }
            );
            res.json(pegawai);
        } catch (error) {
            res.json({ error: true, message: error });
        }
    }
});

module.exports = router;
