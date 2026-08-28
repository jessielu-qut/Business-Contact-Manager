//Jessie add
const express = require('express');
const {
    createSupplier,
    getActiveSuppliers,
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

router.get('/', protect, getActiveSuppliers);
router.get('/pending', protect, adminOnly, getPendingSuppliers);
router.get('/search', protect, searchSuppliers);
router.get('/:id', protect, getSupplierById);

router.post('/', protect, createSupplier);
router.put('/:id', protect, updateSupplier);

router.put('/:id/approve', protect, adminOnly, approveSupplier);
router.put('/:id/reject', protect, adminOnly, rejectSupplier);
router.put('/:id/deactivate', protect, deactivateSupplier);
router.put('/:id/reactivate', protect, reactivateSupplier);

module.exports = router;