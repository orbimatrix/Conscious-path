# Stripe Integration for Payment History

This document explains how to use the new Stripe integration in your admin panel to fetch comprehensive transaction data directly from Stripe.

## Features

### 🔄 Dual Data Sources
- **Stripe (Real-time)**: Fetch live transaction data directly from Stripe
- **Local Database**: Use your existing local payment records

### 📊 Comprehensive Transaction Data
- **Customer Information**: Name, email, phone, address
- **Payment Details**: Amount, currency, status, creation date
- **Payment Methods**: Card type, brand, last 4 digits, expiration
- **Charge Information**: Receipt URLs, failure messages
- **Refund Tracking**: Complete refund history with amounts and reasons
- **Metadata**: Custom fields and additional transaction data

### 🔍 Advanced Filtering & Search
- Search by customer email or name
- Filter by payment status
- Real-time data updates
- Pagination for large transaction lists

## How to Use

### 1. Access the Admin Panel
Navigate to your admin panel and locate the "Payment History" section.

### 2. Choose Data Source
Toggle between:
- **Stripe (Real-time)**: Default option for live Stripe data
- **Local Database**: Your existing payment records

### 3. Search and Filter
- **Search**: Enter customer email or name to find specific transactions
- **Status Filter**: Filter by payment status (succeeded, processing, failed, etc.)
- **Refresh**: Click refresh to get the latest data

### 4. View Transaction Details
Each transaction shows:
- Customer information
- Payment amount and currency
- Payment method details
- Transaction date
- Detailed information including:
  - Charge ID
  - Receipt links
  - Refund information
  - Custom metadata

## API Endpoints

### Stripe Transactions
```
GET /api/admin/stripe-transactions
```

**Query Parameters:**
- `limit`: Number of transactions to fetch (default: 100)
- `starting_after`: Pagination cursor for next page
- `ending_before`: Pagination cursor for previous page
- `status`: Filter by payment status

**Response:**
```json
{
  "payments": [...],
  "hasMore": true,
  "totalCount": 100,
  "pagination": {
    "startingAfter": "pi_xxx",
    "endingBefore": "pi_yyy"
  }
}
```

## Data Structure

### Stripe Payment Object
```typescript
{
  id: string;                    // Stripe payment intent ID
  amount: number;                // Amount in cents
  currency: string;              // Currency code (USD, EUR, etc.)
  status: string;                // Payment status
  created: number;               // Unix timestamp
  customer: {                    // Customer information
    id: string;
    email: string;
    name: string;
    phone: string;
    address: object;
  };
  paymentMethod: {               // Payment method details
    id: string;
    type: string;
    card: {
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
    };
  };
  charge: {                      // Charge information
    id: string;
    amount: number;
    receiptUrl: string;
    failureMessage: string;
    refunds: [...];              // Array of refunds
  };
  metadata: object;              // Custom metadata
  description: string;           // Payment description
}
```

## Benefits

### ✅ Real-time Data
- Always up-to-date transaction information
- No need to sync local database
- Access to Stripe's latest features

### ✅ Professional Reporting
- Industry-standard payment reporting
- Better for accounting and compliance
- Comprehensive audit trails

### ✅ Enhanced Customer Insights
- Complete customer payment history
- Payment method preferences
- Refund and dispute tracking

### ✅ Better Error Handling
- Detailed failure information
- Receipt generation
- Dispute management

## Security

- Admin-only access required
- Stripe API key stored securely
- Customer data protected
- PCI compliance maintained

## Troubleshooting

### Common Issues

1. **No transactions showing**
   - Check your Stripe API key
   - Verify admin permissions
   - Check browser console for errors

2. **Slow loading**
   - Reduce the `limit` parameter
   - Use pagination for large datasets
   - Check your internet connection

3. **Missing data**
   - Ensure Stripe webhooks are configured
   - Check Stripe dashboard for transaction status
   - Verify API permissions

### Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Stripe API configuration
3. Ensure you have admin access
4. Check Stripe's status page for service issues

## Future Enhancements

- Export functionality for financial reporting
- Advanced analytics and insights
- Automated reconciliation
- Multi-currency support
- Subscription management
- Dispute handling
