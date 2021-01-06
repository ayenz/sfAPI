const express = require("express");
const dateFns = require('date-fns');

const router = express.Router();
const Gaji = require("../models/Gaji");
const Pegawai = require("../models/Pegawai");
require("dotenv/config");

const SECRET = process.env.SECRET;

//GET ALL PENGGAJIAN
router.get("/", async (req, res) => {
    try {
        const gaji = await Gaji.find();
        res.json(gaji);
    } catch (error) {
        res.json({ error: true, message: error });
    }
});

//FIND GAJIAN BY date
router.post("/find", async (req, res) => {
    if (req.body.secret != SECRET || req.body.secret == null) {
        res.json({ error: true, message: 'Wrong secret' });
    } else {
        try {
            const startDate = dateFns.toDate(dateFns.addDays(dateFns.parseISO(req.body.startDate), 1));
            const endDate = dateFns.toDate(dateFns.addDays(dateFns.parseISO(req.body.endDate), 1));

            const hasil = await Gaji.find({
                tanggal: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            res.json(hasil);
        } catch (error) {
            res.json({ error: true, message: error });
        }
    }
});

const gajiAndUpdatePegawai = async () => {
    const pegawai = await Pegawai.find();
    let totalPembayaranGaji = 0;
    let gajianPegawai = [];

    for (const iterator of pegawai) {
        if (iterator.status && iterator.totalHariKerja > 0) {
            let potongan = 0 //SEMENTARA FULL AUTO
            if (iterator.jumlahBon > 0) {
                potongan = iterator.cicilanBon;
            }

            gajianPegawai.push({
                _id: iterator._id,
                nama: iterator.nama,
                potongan: potongan,
                totalHariKerja: iterator.totalHariKerja,
                gaji: (iterator.gaji * iterator.totalHariKerja) - potongan
            });

            totalPembayaranGaji += (iterator.gaji * iterator.totalHariKerja) - potongan;
            //UPDATE PEGAWAI ATTRIBUTE AFTER GAJIAN
            const newPegawai = await Pegawai.updateOne(
                { _id: iterator._id },
                {
                    $set: {
                        totalHariKerja: 0,
                        jumlahBon: iterator.jumlahBon - potongan,
                        tanggalDiubah: Date.now()
                    }
                },
                { upsert: true }
            );
        }
    }
    return [totalPembayaranGaji, gajianPegawai];
};

//ADD PENGGAJIAN
router.post("/add", async (req, res) => {
    if (req.body.secret != SECRET || req.body.secret == null) {
        res.json({ error: true, message: 'Wrong secret' });
    }
    else {
        const gajianDetail = await gajiAndUpdatePegawai();
        const gaji = new Gaji({
            totalPembayaranGaji: gajianDetail[0],
            pegawai: gajianDetail[1]
        });
        try {
            const savedPost = await gaji.save();
            res.json(savedPost);
        } catch (error) {
            res.json({ error: true, message: error });
        }
    }
});

//GET GAJIAN BY ID
router.get("/get/:gajianId", async (req, res) => {
    try {
        const gajian = await Gaji.findById(req.params.gajianId);
        res.json(gajian);
    } catch (error) {
        res.json({ error: true, message: error });
    }
});

//DELETE GAJIAN BY ID
router.delete("/delete", async (req, res) => {
    if (req.body.secret != SECRET || req.body.secret == null) {
        res.json({ error: true, message: 'Wrong secret' });
    }
    if (req.body.id == null) {
        res.json({ error: true, message: 'You must specified an id gajian' });
    } else {
        try {
            const gajian = await Gaji.deleteOne({ _id: req.body.id });
            res.json(gajian);
        } catch (error) {
            res.json({ error: true, message: error });
        }
    }
});

module.exports = router;
