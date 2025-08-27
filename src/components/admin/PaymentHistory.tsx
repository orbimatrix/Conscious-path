'use client';

import { useState, useEffect } from 'react';

import type { StripePayment, StripeTransactionsResponse } from '@/lib/types/stripe';

export default function PaymentHistory() {
  const [stripePayments, setStripePayments] = useState<StripePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [userSearch, setUserSearch] = useState<string>('');
  const [stripeLoading, setStripeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    startingAfter: undefined as string | undefined,
    endingBefore: undefined as string | undefined,
    hasMore: false,
  });

  useEffect(() => {
    fetchStripePayments();
  }, []);



  const fetchStripePayments = async (startingAfter?: string, endingBefore?: string, append: boolean = false) => {
    try {
      setStripeLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (startingAfter) params.append('starting_after', startingAfter);
      if (endingBefore) params.append('ending_before', endingBefore);
      if (selectedStatus) params.append('status', selectedStatus);

      const response = await fetch(`/api/admin/stripe-transactions?${params}`);
      if (response.ok) {
        const data: StripeTransactionsResponse = await response.json();
        
        if (append) {
          setStripePayments(prev => [...prev, ...data.payments]);
        } else {
          setStripePayments(data.payments);
        }
        
        setPagination({
          startingAfter: data.pagination.startingAfter,
          endingBefore: data.pagination.endingBefore,
          hasMore: data.hasMore,
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching Stripe payments:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch payments');
    } finally {
      setStripeLoading(false);
      setLoading(false);
    }
  };



  const formatAmount = (amount: number, currency: string | null) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount / 100); // Convert from cents
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  const getStripeStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'requires_payment_method':
        return 'bg-red-100 text-red-800';
      case 'requires_confirmation':
        return 'bg-blue-100 text-blue-800';
      case 'canceled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };



  const filteredStripePayments = stripePayments.filter(payment => {
    if (selectedStatus && payment.status !== selectedStatus) return false;
    if (userSearch.trim()) {
      const searchTerm = userSearch.toLowerCase();
      const customerEmail = payment.customer?.email?.toLowerCase() || '';
      const customerName = payment.customer?.name?.toLowerCase() || '';
      return customerEmail.includes(searchTerm) || customerName.includes(searchTerm);
    }
    return true;
  });



  const handleNextPage = () => {
    if (pagination.startingAfter) {
      fetchStripePayments(pagination.startingAfter);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.endingBefore) {
      fetchStripePayments(undefined, pagination.endingBefore);
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && pagination.startingAfter) {
      fetchStripePayments(pagination.startingAfter, undefined, true);
    }
  };

  if (loading && stripePayments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">Loading payments from Stripe...</div>
        <div className="text-sm text-gray-400">This may take a few moments</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Payment History</h2>
      
      
      
      {/* Filters */}
      <div className="mb-4 sm:mb-6 space-y-4">
        {/* User Search */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Customers
          </label>
          <input
            type="text"
            placeholder="Search by customer email or name..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        
        {/* Status Filter */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
                          <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="">All Statuses</option>
                <option value="succeeded">Succeeded</option>
                <option value="processing">Processing</option>
                <option value="requires_payment_method">Requires Payment Method</option>
                <option value="requires_confirmation">Requires Confirmation</option>
                <option value="canceled">Canceled</option>
              </select>
              {selectedStatus && (
                <button
                  onClick={() => {
                    setSelectedStatus('');
                    fetchStripePayments();
                  }}
                  className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => fetchStripePayments()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">⚠️</span>
              <span className="text-sm font-medium text-red-800">
                Error: {error}
              </span>
            </div>
            <button
              onClick={() => {
                setError(null);
                fetchStripePayments();
              }}
              className="text-xs text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-3 text-center">
          💡 Click on any summary card below to quickly filter the payment data
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div 
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedStatus === '' 
                ? 'bg-blue-100 border-2 border-blue-300 shadow-md' 
                : 'bg-blue-50 hover:bg-blue-100'
            }`}
            onClick={() => {
              setSelectedStatus('');
              fetchStripePayments();
            }}
          >
            <div className="text-sm font-medium text-blue-600">Total Payments</div>
            <div className="text-2xl font-bold text-blue-900">
              {filteredStripePayments.length}
            </div>
            {selectedStatus === '' && (
              <div className="text-xs text-blue-600 mt-1">✓ Active Filter</div>
            )}
          </div>
                      <div 
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedStatus === 'succeeded'
                  ? 'bg-green-100 border-2 border-green-300 shadow-md' 
                  : 'bg-green-50 hover:bg-green-100'
              }`}
              onClick={() => {
                setSelectedStatus('succeeded');
                fetchStripePayments();
              }}
            >
              <div className="text-sm font-medium text-green-600">
                Succeeded
              </div>
              <div className="text-2xl font-bold text-green-900">
                {filteredStripePayments.filter(p => p.status === 'succeeded').length}
              </div>
              {selectedStatus === 'succeeded' && (
                <div className="text-xs text-green-600 mt-1">✓ Active Filter</div>
              )}
            </div>
                      <div 
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedStatus === 'processing'
                  ? 'bg-yellow-100 border-2 border-yellow-300 shadow-md' 
                  : 'bg-yellow-50 hover:bg-yellow-100'
              }`}
              onClick={() => {
                setSelectedStatus('processing');
                fetchStripePayments();
              }}
            >
              <div className="text-sm font-medium text-yellow-600">
                Processing
              </div>
              <div className="text-2xl font-bold text-yellow-900">
                {filteredStripePayments.filter(p => p.status === 'processing').length}
              </div>
              {selectedStatus === 'processing' && (
                <div className="text-xs text-yellow-600 mt-1">✓ Active Filter</div>
              )}
            </div>
                      <div 
              className={`p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedStatus === 'requires_payment_method'
                  ? 'bg-red-100 border-2 border-red-300 shadow-md' 
                  : 'bg-red-50 hover:bg-red-100'
              }`}
              onClick={() => {
                setSelectedStatus('requires_payment_method');
                fetchStripePayments();
              }}
            >
              <div className="text-sm font-medium text-red-600">
                Failed
              </div>
              <div className="text-2xl font-bold text-red-900">
                {filteredStripePayments.filter(p => p.status === 'requires_payment_method').length}
              </div>
              {selectedStatus === 'requires_payment_method' && (
                <div className="text-xs text-red-600 mt-1">✓ Active Filter</div>
              )}
            </div>
        </div>
      </div>

      {/* Stripe Payments Table */}
              {(
        <>
          {/* Current Filter Indicator */}
          {selectedStatus && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600">🔍</span>
                  <span className="text-sm font-medium text-blue-800">
                    Currently showing: <span className="capitalize">{selectedStatus.replace('_', ' ')}</span> payments
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedStatus('');
                    fetchStripePayments();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          )}

          {/* Data Summary */}
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-sm text-gray-600">
                  📊 <span className="font-medium">{stripePayments.length}</span> payments loaded
                </span>
                {pagination.hasMore && (
                  <span className="text-sm text-blue-600">
                    🔄 More payments available
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Showing {filteredStripePayments.length} of {stripePayments.length} loaded payments
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStripePayments.map((payment) => (
                  <tr key={payment.id}>
                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.customer?.name || 'Unknown Customer'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.customer?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAmount(payment.amount, payment.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStripeStatusColor(payment.status)}`}>
                        {payment.status.replace('_', ' ').charAt(0).toUpperCase() + payment.status.replace('_', ' ').slice(1)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.paymentMethod ? (
                        <div>
                          <div className="font-medium">{payment.paymentMethod.type}</div>
                          {payment.paymentMethod.card && (
                            <div className="text-gray-500">
                              {payment.paymentMethod.card.brand} •••• {payment.paymentMethod.card.last4}
                            </div>
                          )}
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(payment.created)}
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate">{payment.description || 'N/A'}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredStripePayments.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                {stripePayments.length === 0 ? (
                  <div>
                    <div className="text-lg font-medium mb-2">No payments found</div>
                    <div className="text-sm">
                      {error ? 'Unable to load payments due to an error' : 'No payments have been processed yet'}
                    </div>
                    {!error && (
                      <button
                        onClick={() => fetchStripePayments()}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Refresh Data
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-lg font-medium mb-2">No payments match your filters</div>
                    <div className="text-sm">
                      Try adjusting your search terms or status filter
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStatus('');
                        setUserSearch('');
                      }}
                      className="mt-3 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={!pagination.endingBefore}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={!pagination.hasMore}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
            </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-sm text-gray-500">
                {stripePayments.length} payments loaded
              </div>
              {pagination.hasMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={stripeLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {stripeLoading ? 'Loading...' : 'Load More'}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      
    </div>
  );
}
