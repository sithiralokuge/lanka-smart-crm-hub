# Lanka Smart CRM Hub

A comprehensive Customer Relationship Management (CRM) solution with advanced customer segmentation, data visualization, and marketing capabilities for retail businesses in Sri Lanka.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Setup and Installation](#setup-and-installation)
- [Backend Services](#backend-services)
- [Data Flow](#data-flow)
- [Customer Segmentation](#customer-segmentation)
- [Custom Segments](#custom-segments)
- [Dashboards](#dashboards)
- [Future Development](#future-development)
- [Known Issues](#known-issues)
- [Contributing](#contributing)

## Overview

Lanka Smart CRM Hub is a specialized CRM platform designed for retail businesses in Sri Lanka. The system provides advanced customer segmentation capabilities, interactive dashboards, and marketing tools to help businesses understand their customers better and make data-driven decisions.

The application consists of a React frontend and multiple Python backend services for data processing, segmentation, and analytics.

## Features

- **Customer Data Management**: Import, view, and manage customer profiles
- **Advanced Segmentation**: Segment customers based on:
  - RFM (Recency, Frequency, Monetary) analysis
  - Demographic information
  - Purchase preferences
  - Custom rule-based segments
- **Interactive Dashboards**: Visualize customer data and segments
- **Marketing Tools**: Target specific customer segments for marketing campaigns
- **Custom Segment Builder**: Create and save custom segments based on multiple criteria
- **MongoDB Integration**: Store and retrieve customer data and segments

## Project Structure

```
lanka-smart-crm-hub/
├── public/                  # Static assets
├── src/
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── marketing/       # Marketing components
│   │   ├── segmentation/    # Segmentation components
│   │   └── ui/              # UI components (shadcn/ui)
│   ├── lib/                 # Utility functions
│   ├── services/            # API services
│   ├── styles/              # CSS styles
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Entry point
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
└── vite.config.ts           # Vite configuration
```

## Technology Stack

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (based on Radix UI)
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Charts**: Recharts
- **HTTP Client**: Native fetch API

### Backend
- **API Server**: Flask (Python)
- **Database**: MongoDB
- **Data Processing**: Pandas, NumPy
- **Machine Learning**: Scikit-learn (for segmentation algorithms)

## Setup and Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Python 3.8+
- MongoDB

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/sithiralokuge/lanka-smart-crm-hub.git
   cd lanka-smart-crm-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. The application will be available at `http://localhost:8081`

### Backend Setup

The application uses multiple Python backend services:

1. **Data Ingestion Service**:
   ```bash
   cd C:\IIT\4th year\FYP\python_algo\crm-data-ingestion
   pip install -r requirements.txt
   python app.py
   ```

2. **Segmentation Service**:
   ```bash
   cd C:\IIT\4th year\FYP\python_algo\crm-segmentation
   pip install -r requirements.txt
   python segmentation.py
   ```

3. **Custom Segment Storage Service**:
   ```bash
   cd C:\IIT\4th year\FYP\python_algo\crm-segment-storing
   pip install -r requirements.txt
   python app.py
   ```

## Backend Services

### 1. Data Ingestion Service (crm-data-ingestion)

Located at `C:\IIT\4th year\FYP\python_algo\crm-data-ingestion`

This service handles:
- Customer data validation
- Data cleaning and preprocessing
- Storing customer profiles in MongoDB
- API endpoints for data retrieval

### 2. Segmentation Service (crm-segmentation)

Located at `C:\IIT\4th year\FYP\python_algo\crm-segmentation`

This service handles:
- RFM (Recency, Frequency, Monetary) segmentation
- Demographic segmentation
- Preference-based segmentation
- Segment calculation and analysis

### 3. Custom Segment Storage Service (crm-segment-storing)

Located at `C:\IIT\4th year\FYP\python_algo\crm-segment-storing`

This service handles:
- Storing custom segments in MongoDB
- Retrieving segment options from customer data
- Calculating segment sizes based on rules
- Converting segment rules to MongoDB queries

## Data Flow

1. **Data Ingestion**:
   - Customer data is imported through the frontend
   - Data is validated and processed by the Data Ingestion Service
   - Processed data is stored in MongoDB

2. **Segmentation**:
   - The Segmentation Service retrieves customer data from MongoDB
   - Applies segmentation algorithms (RFM, demographic, preference)
   - Results are sent back to the frontend for visualization

3. **Custom Segments**:
   - Users create custom segments using the Segment Builder
   - Segment rules are sent to the Custom Segment Storage Service
   - Service calculates segment size and stores the segment in MongoDB
   - Segments can be used for marketing campaigns and dashboards

## Customer Segmentation

The system uses multiple segmentation approaches:

### RFM Segmentation

Segments customers based on:
- **Recency**: How recently a customer made a purchase
- **Frequency**: How often a customer makes purchases
- **Monetary**: How much a customer spends

Resulting in segments like:
- Champions
- Loyal Customers
- Potential Loyalists
- At Risk
- Lost Customers

### Preference Segmentation

Segments customers based on their purchase preferences:
- Product categories
- Materials
- Brands
- Price points

Resulting in segments like:
- Fashion Enthusiasts
- Casual Shoppers
- Seasonal Buyers
- Brand Loyalists

### Demographic Segmentation

Segments customers based on demographic information:
- Age
- Gender
- Location
- Income level

## Custom Segments

The Segment Builder allows users to create custom segments based on multiple criteria:

- RFM segments
- Product categories
- Materials
- Purchase frequency
- Age ranges
- Gender
- Location
- Preference segments

Custom segments are stored in MongoDB and can be used for:
- Marketing campaigns
- Dashboard visualizations
- Customer targeting
- Sales analysis

## Dashboards

The application provides multiple dashboards:

1. **Home Dashboard**: Overview of key metrics and segments
2. **RFM Dashboard**: Detailed view of RFM segments
3. **Preference Dashboard**: Analysis of customer preferences
4. **Custom Dashboard**: User-created dashboards with selected metrics

Each dashboard includes:
- Pie charts for segment distribution
- Bar charts for comparative analysis
- Line charts for trend analysis
- Data tables for detailed information

## Future Development

### Planned Features

1. **Advanced Marketing Automation**:
   - Email campaign scheduling
   - SMS marketing integration
   - Campaign performance tracking

2. **Predictive Analytics**:
   - Customer lifetime value prediction
   - Churn prediction
   - Product recommendation engine

3. **Enhanced Reporting**:
   - Exportable reports
   - Scheduled report generation
   - Custom report templates

4. **Mobile Application**:
   - iOS and Android apps for on-the-go access
   - Push notifications for important metrics

### Integration Opportunities

1. **E-commerce Integration**:
   - WooCommerce
   - Shopify
   - Magento

2. **Payment Gateway Integration**:
   - PayHere
   - Stripe
   - PayPal

3. **Social Media Integration**:
   - Facebook
   - Instagram
   - Twitter

## Known Issues

1. **Segmentation API Connection**:
   - The frontend falls back to localStorage if the backend is not available
   - Need to ensure MongoDB is running for proper segment storage

2. **Performance with Large Datasets**:
   - Dashboard rendering can be slow with very large customer datasets
   - Consider implementing pagination or data sampling

3. **Browser Compatibility**:
   - Some visualizations may not render correctly in older browsers
   - Tested primarily on Chrome and Firefox

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## Contact

For any questions or support, please contact:
- Project Lead: [Sithira Lokuge](mailto:sithiralokuge@gmail.com)
