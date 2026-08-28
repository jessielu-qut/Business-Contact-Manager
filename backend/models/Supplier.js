//Jessie add

const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending Approval', 'Active', 'Inactive', 'Rejected'],
        default: 'Pending Approval'
    },
    qualificationStatus: { type: String, default: 'Pending confirmation' },
    rejectReason: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);