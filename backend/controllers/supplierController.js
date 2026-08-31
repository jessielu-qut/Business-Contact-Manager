// Jessie add
const Supplier = require('../models/Supplier');

const createSupplier = async (req, res) => {
    const { companyName, address, phoneNumber } = req.body;
    try {
        const supplier = await Supplier.create({
            companyName,
            address,
            phoneNumber,
            status: req.user.role === 'admin' ? 'Active' : 'Pending Approval',
            createdBy: req.user.id,
        });
        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({
            status: { $in: ['Active', 'Inactive', 'Rejected'] }
        });
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPendingSuppliers = async (req, res) => {
    try {
        const query =
            req.user.role === 'admin'
                ? { status: 'Pending Approval' }
                : {
                    status: 'Pending Approval',
                    createdBy: req.user.id,
                };

        const suppliers = await Supplier.find(query);

        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchSuppliers = async (req, res) => {
    const { keyword } = req.query;
    try {
        const suppliers = await Supplier.find({
            companyName: { $regex: keyword, $options: 'i' },
        });
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSupplier = async (req, res) => {
    const { companyName, address, phoneNumber } = req.body;
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        supplier.companyName = companyName || supplier.companyName;
        supplier.address = address || supplier.address;
        supplier.phoneNumber = phoneNumber || supplier.phoneNumber;

        const updatedSupplier = await supplier.save();
        res.json(updatedSupplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        supplier.status = 'Active';
        const updatedSupplier = await supplier.save();
        res.json(updatedSupplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const rejectSupplier = async (req, res) => {
    const { reason } = req.body;
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        supplier.status = 'Rejected';
        supplier.rejectReason = reason;
        const updatedSupplier = await supplier.save();
        res.json(updatedSupplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deactivateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        supplier.status = 'Inactive';
        const updatedSupplier = await supplier.save();
        res.json(updatedSupplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const reactivateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

        supplier.status = 'Active';
        const updatedSupplier = await supplier.save();
        res.json(updatedSupplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSupplier,
    getSuppliers,
    getPendingSuppliers,
    searchSuppliers,
    getSupplierById,
    updateSupplier,
    approveSupplier,
    rejectSupplier,
    deactivateSupplier,
    reactivateSupplier,
};