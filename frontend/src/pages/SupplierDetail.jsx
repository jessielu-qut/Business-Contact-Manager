import {
  useState,
  useEffect,
  useCallback,
} from 'react';

import { useAuth } from '../context/AuthContext';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import axiosInstance from '../axiosConfig';
import UserMenu from '../components/UserMenu';

const SupplierDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isNew = !id;

  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    phoneNumber: '',
  });

  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] =
    useState(isNew);

  const [rejectReason, setRejectReason] =
    useState('');

  const [
    showRejectBox,
    setShowRejectBox,
  ] = useState(false);

  const [searchTerm, setSearchTerm] =
    useState('');

  const [contacts, setContacts] =
    useState([]);

  const [
    editingContactId,
    setEditingContactId,
  ] = useState(null);

  const [
    contactDraft,
    setContactDraft,
  ] = useState({
    role: '',
    name: '',
    email: '',
    phone: '',
    remark: '',
    isMainContact: false,
  });

  const [
    contactErrors,
    setContactErrors,
  ] = useState({});

  const fetchSupplier =
    useCallback(async () => {
      try {
        const res =
          await axiosInstance.get(
            `/api/suppliers/${id}`
          );

        setFormData({
          companyName:
            res.data.companyName,
          address:
            res.data.address,
          phoneNumber:
            res.data.phoneNumber,
        });

        setStatus(res.data.status);

        setRejectReason(
          res.data.rejectReason || ''
        );
      } catch (error) {
        console.error(
          'Failed to fetch supplier',
          error
        );
      }
    }, [id]);

  useEffect(() => {
    if (!isNew) {
      fetchSupplier();
    }
  }, [isNew, fetchSupplier]);

  const fetchContacts =
    useCallback(async () => {
      try {
        const res =
          await axiosInstance.get(
            `/api/supplier-contacts/${id}`
          );

        setContacts(res.data);
      } catch (error) {
        console.error(
          'Failed to fetch contacts',
          error
        );
      }
    }, [id]);

  useEffect(() => {
    if (!isNew) {
      fetchContacts();
    }
  }, [isNew, fetchContacts]);

  const validate = () => {
    const newErrors = {};

    if (
      !formData.companyName.trim()
    ) {
      newErrors.companyName =
        'Field cannot be empty.';
    }

    if (
      !formData.address.trim()
    ) {
      newErrors.address =
        'Field cannot be empty.';
    }

    if (
      !formData.phoneNumber.trim()
    ) {
      newErrors.phoneNumber =
        'Field cannot be empty.';
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors =
      validate();

    if (
      Object.keys(
        validationErrors
      ).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      if (isNew) {
        const res =
          await axiosInstance.post(
            '/api/suppliers',
            formData
          );

        setIsEditing(false);

        navigate(
          `/suppliers/${res.data._id}`
        );
      }
      else {
        await axiosInstance.put(
          `/api/suppliers/${id}`,
          formData
        );

        setIsEditing(false);
      }
    } catch (error) {
      setErrors({
        general:
          'Something went wrong. Please try again.',
      });
    }
  };

  const handleCancel = () => {
    if (isNew) {
      navigate('/suppliers');
      return;
    }

    setErrors({});
    setIsEditing(false);
    fetchSupplier();
  };

  const handleApprove =
    async () => {
      await axiosInstance.put(
        `/api/suppliers/${id}/approve`
      );

      navigate('/suppliers');
    };

  const handleReject =
    async () => {
      await axiosInstance.put(
        `/api/suppliers/${id}/reject`,
        {
          reason: rejectReason,
        }
      );

      navigate('/suppliers');
    };

  const handleDeactivate =
    async () => {
      await axiosInstance.put(
        `/api/suppliers/${id}/deactivate`
      );

      setStatus('Inactive');
    };

  const handleReactivate =
    async () => {
      await axiosInstance.put(
        `/api/suppliers/${id}/reactivate`
      );

      setStatus('Active');
    };

  const startAddContact = () => {
    setContactDraft({
      role: '',
      name: '',
      email: '',
      phone: '',
      remark: '',
      isMainContact: false,
    });

    setContactErrors({});
    setEditingContactId('new');
  };

  const startEditContact = (
    contact
  ) => {
    setContactDraft({
      role: contact.role,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      remark:
        contact.remark || '',
      isMainContact:
        contact.isMainContact,
    });

    setContactErrors({});

    setEditingContactId(
      contact._id
    );
  };

  const toggleMainContact = () => {
    setContactDraft((prev) => ({
      ...prev,
      isMainContact:
        !prev.isMainContact,
    }));
  };

  const saveContact = async () => {
    const errs = {};

    if (
      !contactDraft.role.trim()
    ) {
      errs.role =
        'Field cannot be empty.';
    }

    if (
      !contactDraft.name.trim()
    ) {
      errs.name =
        'Field cannot be empty.';
    }

    if (
      !contactDraft.email.trim()
    ) {
      errs.email =
        'Field cannot be empty.';
    }

    if (
      !contactDraft.phone.trim()
    ) {
      errs.phone =
        'Field cannot be empty.';
    }

    if (
      Object.keys(errs).length > 0
    ) {
      setContactErrors(errs);
      return;
    }

    setContactErrors({});

    try {
      if (
        editingContactId ===
        'new'
      ) {
        await axiosInstance.post(
          `/api/supplier-contacts/${id}`,
          contactDraft
        );
      } else {
        await axiosInstance.put(
          `/api/supplier-contacts/${editingContactId}`,
          contactDraft
        );
      }

      setEditingContactId(null);
      fetchContacts();
    } catch (error) {
      console.error(
        'Failed to save contact',
        error
      );
    }
  };

  const renderContactForm =
    () => (
      <div className="min-h-[205px] rounded-xl border border-gray-200 bg-[#EEF1F1] p-5 shadow-sm">
        <div className="mb-3 flex items-start justify-between">
          <button
            type="button"
            onClick={
              toggleMainContact
            }
            className="flex items-center gap-2 font-bold text-gray-800"
          >
            <span className="text-xl text-yellow-600">
              {contactDraft.isMainContact
                ? '★'
                : '☆'}
            </span>

            {contactDraft.isMainContact
              ? 'Main Contact'
              : 'Contact'}
          </button>

          <button
            onClick={saveContact}
            className="text-xl font-bold text-green-700"
          >
            ✓
          </button>
        </div>

        <div className="space-y-2">
          {[
            'role',
            'name',
            'email',
            'phone',
            'remark',
          ].map((field) => (
            <div key={field}>
              <div className="grid grid-cols-[70px_minmax(0,1fr)] items-center gap-2 text-sm">
                <span className="capitalize text-gray-700">
                  {field}:
                </span>

                <input
                  value={
                    contactDraft[
                    field
                    ]
                  }
                  onChange={(e) =>
                    setContactDraft(
                      {
                        ...contactDraft,
                        [field]:
                          e.target
                            .value,
                      }
                    )
                  }
                  className="min-w-0 rounded-md border border-gray-300 bg-white px-2 py-1 outline-none"
                />
              </div>

              {contactErrors[
                field
              ] && (
                  <p className="ml-[78px] mt-1 text-xs text-red-600">
                    *
                    {
                      contactErrors[
                      field
                      ]
                    }
                  </p>
                )}
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-8 lg:px-10">
        <div className="mb-10 grid grid-cols-[auto_minmax(300px,1fr)_auto] items-center gap-8 lg:gap-14">
          <h1 className="whitespace-nowrap text-2xl font-bold text-gray-900 lg:text-3xl">
            Supplier Contact Detail
          </h1>

          <div className="flex justify-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Search bar"
              className="w-full max-w-[650px] rounded-2xl bg-[#F1F5F4] px-6 py-3 text-center text-base outline-none"
            />
          </div>

          <div className="flex justify-end">
            <UserMenu />
          </div>
        </div>

        <div className="mb-7 flex items-center justify-between">
          <button
            onClick={() =>
              navigate(
                '/suppliers'
              )
            }
            className="min-w-[180px] rounded-xl bg-black px-7 py-3 text-base font-semibold text-white"
          >
            Back to list
          </button>

          <div className="flex items-center gap-5">
            {status ===
              'Pending Approval' &&
              user?.role ===
              'admin' &&
              !isEditing && (
                <>
                  <button
                    onClick={
                      handleApprove
                    }
                    className="min-w-[145px] rounded-xl bg-indigo-800 px-6 py-3 font-semibold text-white"
                  >
                    ✓ Approve
                  </button>

                  <button
                    onClick={() =>
                      setShowRejectBox(
                        true
                      )
                    }
                    className="min-w-[145px] rounded-xl bg-red-700 px-6 py-3 font-semibold text-white"
                  >
                    ✕ Reject
                  </button>
                </>
              )}

            {status ===
              'Active' &&
              !isEditing && (
                <button
                  onClick={
                    handleDeactivate
                  }
                  className="min-w-[155px] rounded-xl bg-red-700 px-6 py-3 font-semibold text-white"
                >
                  Deactivate
                </button>
              )}

            {status ===
              'Inactive' &&
              !isEditing && (
                <button
                  onClick={
                    handleReactivate
                  }
                  className="min-w-[155px] rounded-xl bg-green-700 px-6 py-3 font-semibold text-white"
                >
                  Reactivate
                </button>
              )}

            {isNew && (
              <>
                <button
                  onClick={
                    handleSubmit
                  }
                  className="min-w-[145px] rounded-xl bg-green-700 px-7 py-3 font-semibold text-white"
                >
                  ✓ Submit
                </button>

                <button
                  onClick={
                    handleCancel
                  }
                  className="min-w-[145px] rounded-xl bg-red-700 px-7 py-3 font-semibold text-white"
                >
                  ✕ Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {showRejectBox && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-32"
            onClick={() =>
              setShowRejectBox(
                false
              )
            }
          >
            <div
              className="w-96 rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <p className="mb-3 text-lg font-bold">
                Reject reason:
              </p>

              <textarea
                value={
                  rejectReason
                }
                onChange={(e) =>
                  setRejectReason(
                    e.target.value
                  )
                }
                className="mb-4 w-full rounded-xl bg-[#DCEEEA] p-3 outline-none"
                rows={4}
              />

              <div className="flex justify-end">
                <button
                  onClick={
                    handleReject
                  }
                  className="rounded-xl bg-black px-6 py-2.5 font-semibold text-white"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl bg-[#F7F7F7] px-8 py-8 shadow-sm lg:px-14">
          {!isNew && (
            <div className="relative mb-10 flex min-h-[42px] items-center justify-center">
              {status && (
                <p className="text-center text-lg font-bold text-red-700">
                  Status:{' '}
                  {status}
                </p>
              )}

              {isEditing && (
                <div className="absolute right-0 flex items-center gap-3">
                  <button
                    onClick={
                      handleSubmit
                    }
                    className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white"
                  >
                    ✓ Save
                  </button>

                  <button
                    onClick={
                      handleCancel
                    }
                    className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                  >
                    ✕ Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mx-auto max-w-[1050px] space-y-6">
            <div>
              <div className="grid grid-cols-[170px_minmax(0,1fr)] items-center gap-6">
                <label className="text-base font-medium text-gray-900">
                  Company name
                </label>

                <input
                  value={
                    formData.companyName
                  }
                  disabled={
                    !isNew &&
                    !isEditing
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      companyName:
                        e.target
                          .value,
                    })
                  }
                  className="w-full rounded-xl bg-[#DCEEEA] px-5 py-3 text-base outline-none disabled:cursor-default"
                />
              </div>

              {errors.companyName && (
                <p className="ml-[196px] mt-1 text-sm text-red-600">
                  *
                  {
                    errors.companyName
                  }
                </p>
              )}
            </div>

            <div>
              <div className="grid grid-cols-[170px_minmax(0,1fr)] items-center gap-6">
                <label className="text-base font-medium text-gray-900">
                  Address
                </label>

                <input
                  value={
                    formData.address
                  }
                  disabled={
                    !isNew &&
                    !isEditing
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address:
                        e.target
                          .value,
                    })
                  }
                  className="w-full rounded-xl bg-[#DCEEEA] px-5 py-3 text-base outline-none disabled:cursor-default"
                />
              </div>

              {errors.address && (
                <p className="ml-[196px] mt-1 text-sm text-red-600">
                  *
                  {
                    errors.address
                  }
                </p>
              )}
            </div>

            <div>
              <div className="grid grid-cols-[170px_minmax(0,1fr)] items-center gap-6">
                <label className="text-base font-medium text-gray-900">
                  Phone number
                </label>

                <input
                  value={
                    formData.phoneNumber
                  }
                  disabled={
                    !isNew &&
                    !isEditing
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phoneNumber:
                        e.target
                          .value,
                    })
                  }
                  className="w-full rounded-xl bg-[#DCEEEA] px-5 py-3 text-base outline-none disabled:cursor-default"
                />
              </div>

              {errors.phoneNumber && (
                <p className="ml-[196px] mt-1 text-sm text-red-600">
                  *
                  {
                    errors.phoneNumber
                  }
                </p>
              )}
            </div>

            {errors.general && (
              <p className="ml-[196px] text-sm text-red-600">
                {errors.general}
              </p>
            )}

            <div className="grid grid-cols-[170px_minmax(0,1fr)] items-center gap-6">
              <p className="text-base font-medium text-gray-900">
                Qualification
              </p>

              <p className="text-sm italic text-gray-400">
                To be developed
              </p>
            </div>

            {status ===
              'Rejected' &&
              rejectReason && (
                <div className="grid grid-cols-[170px_minmax(0,1fr)] items-start gap-6">
                  <p className="text-base font-medium text-gray-900">
                    Rejection reason
                  </p>

                  <div className="rounded-xl bg-red-50 px-5 py-3 text-sm text-red-700">
                    {
                      rejectReason
                    }
                  </div>
                </div>
              )}

            {!isNew &&
              !isEditing && (
                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      setIsEditing(
                        true
                      )
                    }
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700"
                  >
                    ✎ Edit
                  </button>
                </div>
              )}
          </div>

          {!isNew && (
            <div className="mt-12 border-t border-gray-200 pt-9">
              <h2 className="mb-7 text-center text-xl font-bold text-gray-800">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {contacts.map(
                  (contact) =>
                    editingContactId ===
                      contact._id ? (
                      <div
                        key={
                          contact._id
                        }
                      >
                        {
                          renderContactForm()
                        }
                      </div>
                    ) : (
                      <div
                        key={
                          contact._id
                        }
                        className="min-h-[205px] rounded-xl border border-gray-200 bg-[#EEF1F1] p-5 shadow-sm"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <p
                            className={`flex items-center gap-2 font-bold ${contact.isMainContact
                                ? 'text-[#8A6C2D]'
                                : 'text-gray-800'
                              }`}
                          >
                            {contact.isMainContact && (
                              <span className="text-xl text-yellow-600">
                                ★
                              </span>
                            )}

                            {contact.isMainContact
                              ? 'Main Contact'
                              : 'Contact'}
                          </p>

                          <button
                            onClick={() =>
                              startEditContact(
                                contact
                              )
                            }
                            className="text-xl text-gray-800"
                          >
                            ✎
                          </button>
                        </div>

                        <div className="space-y-1 text-base leading-relaxed text-gray-700">
                          <p>
                            Role:{' '}
                            {
                              contact.role
                            }
                          </p>

                          <p>
                            Name:{' '}
                            {
                              contact.name
                            }
                          </p>

                          <p className="break-words">
                            Email:{' '}
                            {
                              contact.email
                            }
                          </p>

                          <p>
                            Phone:{' '}
                            {
                              contact.phone
                            }
                          </p>

                          {contact.remark && (
                            <p>
                              Remark:{' '}
                              {
                                contact.remark
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    )
                )}

                {editingContactId ===
                  'new' ? (
                  renderContactForm()
                ) : (
                  <button
                    onClick={
                      startAddContact
                    }
                    className="flex min-h-[205px] items-center justify-center rounded-xl border border-gray-200 bg-[#EEF1F1] text-6xl font-light text-gray-500 shadow-sm"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;