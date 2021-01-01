const express = require("express");
const router = express.Router();
const Borongan = require("../models/Borongan");
require("dotenv/config");

const SECRET = process.env.SECRET;

//GET ALL BORONGAN
router.get("/", async (req, res) => {
    try {
        const borongan = await Borongan.find();
        res.json(borongan);
    } catch (error) {
        res.json({ error: true, message: error });
    }
});

//ADD BORONGAN
router.post("/add", async (req, res) => {
    if (req.body.secret != SECRET || req.body.secret == null) {
        res.json({ error: true, message: 'Wrong secret' });
    }
    else {
        const borongan = new Borongan({
            nama: req.body.nama,
            telp: req.body.telp,
            nilaiBorongan: req.body.nilaiBorongan,
            statusBorongan: req.body.statusBorongan,
            belumDibayar: req.body.nilaiBorongan
        });
        try {
            const savedPost = await borongan.save();
            res.json(savedPost);
        } catch (error) {
            res.json({ error: true, message: error });
        }
    }
});

//GET BORONGAN BY ID
router.get("/get/:boronganId", async (req, res) => {
    try {
        const borongan = await Borongan.findById(req.params.boronganId);
        res.json(borongan);
    } catch (error) {
        res.json({ error: true, message: error });
    }
});

//DELETE BORONGAN BY ID
router.delete("/delete", async (req, res) => {
    if (req.body.secret != SECRET || req.body.secret == null) {
        res.json({ error: true, message: 'Wrong secret' });
    }
    if (req.body.id == null) {
        res.json({ error: true, message: 'You must specified an id borongan' });
    } else {
        try {
            const borongan = await Borongan.deleteOne({ _id: req.body.id });
            res.json(borongan);
        } catch (error) {
            res.json({ error: true, message: error });
        }
    }
});

//UDPATE PEMBAYARAN BY ID
router.patch("/update/pembayaran", async (req, res) => {
    if (req.body.secret != SECRET || req.body.secret == null) {
        res.json({ error: true, message: 'Wrong secret' });
    } else {
        try {
            const borongan = await Borongan.findById(req.body.id);

            const id = req.body.id;
            const nilaiPembayaran = req.body.nilaiPembayaran;
            const tanggalPembayaran = Date.now();

            let nilaiBorongan = borongan.nilaiBorongan;

            borongan.pembayaran.forEach(element => {
                nilaiBorongan -= element.nilaiPembayaran;
            });

            const totalBelumDibayar = nilaiBorongan - nilaiPembayaran;
            const statusBorongan = (totalBelumDibayar <= 0) ? false : true;
            const pembayaranCicilan = await Borongan.updateOne(
                { _id: id },
                {
                    $push: {
                        pembayaran: {
                            nilaiPembayaran: nilaiPembayaran,
                            tanggalPembayaran: tanggalPembayaran
                        }
                    },
                    $set: {
                        belumDibayar: totalBelumDibayar,
                        statusBorongan: statusBorongan
                    }
                },
                { upsert: true }
            );
            res.json(pembayaranCicilan);
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
            const id = req.body.id;
            const boronganOldData = await Borongan.findById(id);
            const nama = (req.body.nama == null) ? boronganOldData.nama : req.body.nama;
            const telp = (req.body.telp == null) ? boronganOldData.telp : req.body.telp;
            const nilaiBorongan = (req.body.nilaiBorongan == null) ? boronganOldData.nilaiBorongan : req.body.nilaiBorongan;
            const statusBorongan = (req.body.statusBorongan == null) ? boronganOldData.statusBorongan : req.body.statusBorongan;

            let belumDibayar = nilaiBorongan;

            boronganOldData.pembayaran.forEach(element => {
                belumDibayar -= element.nilaiPembayaran;
            });

            const borongan = await Borongan.updateOne(
                { _id: id },
                {
                    $set: {
                        nama: nama,
                        telp: telp,
                        nilaiBorongan: nilaiBorongan,
                        statusBorongan: statusBorongan,
                        belumDibayar: belumDibayar
                    }
                },
                { upsert: true }
            );
            res.json(borongan);
        } catch (error) {
            res.json({ error: true, message: error });
        }
    }
});

module.exports = router;
