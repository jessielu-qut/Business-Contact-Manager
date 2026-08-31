import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import UserMenu from '../components/UserMenu';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [pendingSuppliers, setPendingSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axiosInstance.get('/api/suppliers');
        setSuppliers(res.data);
      } catch (error) {
        console.error('Failed to fetch suppliers', error);
      }
    };

    const fetchPending = async () => {
      try {
        const res = await axiosInstance.get('/api/suppliers/pending');
        setPendingSuppliers(res.data);
      } catch (error) {
        console.error('Failed to fetch pending suppliers', error);
      }
    };

    fetchSuppliers();
    fetchPending();
  }, [user]);

  const handleSearch = async (term) => {
    setSearchTerm(term);

    if (!term.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      const res = await axiosInstance.get(
        `/api/suppliers/search?keyword=${encodeURIComponent(term)}`
      );

      setSearchResults(res.data);
    } catch (error) {
      console.error('Failed to search suppliers', error);
    }
  };

  const filteredSuppliers =
    statusFilter === 'All'
      ? suppliers
      : suppliers.filter(
          (supplier) =>
            supplier.status === statusFilter
        );

  const getStatusStyle = (status) => {
    if (status === 'Active') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'Inactive') {
      return 'bg-gray-300 text-gray-700';
    }

    if (status === 'Rejected') {
      return 'bg-red-100 text-red-700';
    }

    return 'bg-yellow-100 text-yellow-700';
  };

  const renderSupplierCard = (supplier) => (
    <button
      key={supplier._id}
      type="button"
      onClick={() =>
        navigate(`/suppliers/${supplier._id}`)
      }
      className="flex min-h-[150px] w-full flex-col items-center justify-center rounded-xl bg-[#EEF1F1] p-5 text-center shadow-sm transition hover:bg-gray-200"
    >
      <p className="mb-4 text-lg font-bold text-gray-900">
        {supplier.companyName}
      </p>

      <span
        className={`rounded-full px-4 py-1.5 text-xs font-semibold ${getStatusStyle(
          supplier.status
        )}`}
      >
        {supplier.status}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-8 lg:px-10">
        <div className="mb-10 grid grid-cols-[auto_minmax(300px,1fr)_auto_auto] items-center gap-6 lg:gap-10">
          <h1 className="whitespace-nowrap text-2xl font-bold text-gray-900 lg:text-3xl">
            Supplier Contact List
          </h1>

          <div className="flex justify-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
              placeholder="Search bar"
              className="w-full max-w-[650px] rounded-2xl bg-[#F1F5F4] px-6 py-3 text-center text-base outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              navigate('/suppliers/new')
            }
            className="min-w-[120px] rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white"
          >
            Create
          </button>

          <div className="flex justify-end">
            <UserMenu />
          </div>
        </div>

        {searchResults !== null ? (
          <section>
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              Search Results
            </h2>

            {searchResults.length === 0 ? (
              <div className="rounded-xl bg-[#F7F7F7] px-6 py-10 text-center text-gray-500">
                No suppliers found for "{searchTerm}".
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {searchResults.map((supplier) =>
                  renderSupplierCard(supplier)
                )}
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="mb-12">
              <h2 className="mb-5 text-xl font-bold text-gray-900">
                Pending Approval
              </h2>

              {pendingSuppliers.length === 0 ? (
                <div className="rounded-xl bg-[#F7F7F7] px-6 py-8 text-gray-500">
                  No suppliers pending approval.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {pendingSuppliers.map(
                    (supplier) => (
                      <button
                        key={supplier._id}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/suppliers/${supplier._id}`
                          )
                        }
                        className="min-h-[125px] rounded-xl bg-[#EEF1F1] p-5 text-left shadow-sm transition hover:bg-gray-200"
                      >
                        <p className="mb-2 text-xs font-bold text-red-600">
                          NEW
                        </p>

                        <p className="text-lg font-bold text-gray-900">
                          {supplier.companyName}
                        </p>

                        <span className="mt-3 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                          Pending Approval
                        </span>
                      </button>
                    )
                  )}
                </div>
              )}
            </section>

            <section>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Supplier List
                </h2>

                <div className="flex flex-wrap gap-2">
                  {[
                    'All',
                    'Active',
                    'Inactive',
                    'Rejected',
                  ].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() =>
                        setStatusFilter(filter)
                      }
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        statusFilter === filter
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {filteredSuppliers.length === 0 ? (
                <div className="rounded-xl bg-[#F7F7F7] px-6 py-10 text-center text-gray-500">
                  No suppliers found for this status.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredSuppliers.map(
                    (supplier) =>
                      renderSupplierCard(supplier)
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default SupplierList;