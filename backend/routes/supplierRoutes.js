//Jessie add
const express = require('express');
const {
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
} = require('../controllers/supplierController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getSuppliers);
router.get('/pending', protect, getPendingSuppliers);
router.get('/search', protect, searchSuppliers);
router.get('/:id', protect, getSupplierById);

router.post('/', protect, createSupplier);
router.put('/:id', protect, updateSupplier);

router.put('/:id/approve', protect, adminOnly, approveSupplier);
router.put('/:id/reject', protect, adminOnly, rejectSupplier);
router.put('/:id/deactivate', protect, deactivateSupplier);
router.put('/:id/reactivate', protect, reactivateSupplier);

module.exports = router;