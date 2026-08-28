//Jessie add

const mongoose = require('mongoose');

const supplierContactSchema = new mongoose.Schema({
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    role: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    remark: { type: String },
    isMainContact: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('SupplierContact', supplierContactSchema);