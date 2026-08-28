//Jessie add
const SupplierContact = require('../models/SupplierContact');

const getContactsBySupplier = async (req, res) => {
    try {
        const contacts = await SupplierContact.find({ supplierId: req.params.supplierId });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addContact = async (req, res) => {
    const { role, name, email, phone, remark, isMainContact } = req.body;
    try {
        if (isMainContact) {
            await SupplierContact.updateMany(
                { supplierId: req.params.supplierId },
                { isMainContact: false }
            );
        }
        const contact = await SupplierContact.create({
            supplierId: req.params.supplierId,
            role,
            name,
            email,
            phone,
            remark,
            isMainContact: isMainContact || false,
        });
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateContact = async (req, res) => {
    const { role, name, email, phone, remark, isMainContact } = req.body;
    try {
        const contact = await SupplierContact.findById(req.params.id);
        if (!contact) return res.status(404).json({ message: 'Contact not found' });

        if (isMainContact) {
            await SupplierContact.updateMany(
                { supplierId: contact.supplierId },
                { isMainContact: false }
            );
        }

        contact.role = role || contact.role;
        contact.name = name || contact.name;
        contact.email = email || contact.email;
        contact.phone = phone || contact.phone;
        contact.remark = remark || contact.remark;
        contact.isMainContact = isMainContact ?? contact.isMainContact;

        const updatedContact = await contact.save();
        res.json(updatedContact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getContactsBySupplier, addContact, updateContact };