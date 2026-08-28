// Jessie add
const express = require('express');
const {
    getContactsBySupplier,
    addContact,
    updateContact,
} = require('../controllers/supplierContactController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:supplierId', protect, getContactsBySupplier);
router.post('/:supplierId', protect, addContact);
router.put('/:id', protect, updateContact);

module.exports = router;