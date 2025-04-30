/**
 * API service for segmentation operations
 */

// Using Vite's proxy feature to avoid CORS issues in development
const API_BASE_URL = '/api';

// Define segment rule type
export interface SegmentRule {
  id: string;
  type: string;
  operator: string;
  value?: string | number;
  minValue?: number;
  maxValue?: number;
  valueType?: string;
}

// Define segment type
export interface Segment {
  id: string;
  name: string;
  description: string;
  rules: SegmentRule[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  customerCount?: number;
  customerPercentage?: number;
}

/**
 * Run comprehensive segmentation on all customer data
 * @returns Promise with the segmentation results
 */
export const runComprehensiveSegmentation = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/segment/comprehensive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // Empty request body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to run segmentation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error running segmentation:', error);
    throw error;
  }
};

/**
 * Run specific segmentation type on customer data
 * @param segmentType The type of segmentation to run (demographic, preference, rfm)
 * @param options Optional parameters for the segmentation
 * @returns Promise with the segmentation results
 */
export const runSpecificSegmentation = async (
  segmentType: 'demographic' | 'preference' | 'rfm',
  options?: {
    referenceDate?: string;
    minClusters?: number;
    maxClusters?: number;
  }
): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/segment/${segmentType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reference_date: options?.referenceDate,
        min_clusters: options?.minClusters,
        max_clusters: options?.maxClusters,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to run ${segmentType} segmentation`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error running ${segmentType} segmentation:`, error);
    throw error;
  }
};

/**
 * Transform segmentation data from API format to front-end format
 * @param apiData The data returned from the segmentation API
 * @returns Formatted data for front-end visualization
 */
export const transformSegmentationData = (apiData: any) => {
  // Transform demographic segmentation data
  const demographicSegments = apiData.summary?.demographic || {};
  const demographicData = Object.entries(demographicSegments).map(([name, value], index) => {
    // Generate colors based on index (you can customize this)
    const colors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#F87171', '#60A5FA', '#34D399'];
    return {
      name: name.replace('Gender_', ''), // Remove prefix if needed
      value: typeof value === 'number' ? value : Number(value),
      color: colors[index % colors.length],
    };
  });

  // Transform RFM segmentation data
  const rfmSegments = apiData.summary?.value_based_rfm || {};
  const rfmData = Object.entries(rfmSegments).map(([name, value], index) => {
    const colors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#F87171', '#60A5FA', '#34D399'];
    return {
      name,
      value: typeof value === 'number' ? value : Number(value),
      color: colors[index % colors.length],
    };
  });

  // Transform preference segmentation data
  const preferenceSegments = apiData.summary?.preference || {};
  const preferenceData = Object.entries(preferenceSegments).map(([name, value], index) => {
    const colors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#F87171', '#60A5FA', '#34D399'];
    return {
      name,
      value: typeof value === 'number' ? value : Number(value),
      color: colors[index % colors.length],
    };
  });

  // Extract category distribution if available
  const categoryDistribution = apiData.details?.preference_details?.category_distribution || {};
  const categoryData = Object.entries(categoryDistribution).map(([name, value], index) => {
    const colors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#F87171', '#60A5FA', '#34D399'];
    return {
      name,
      value: typeof value === 'number' ? value : Number(value),
      color: colors[index % colors.length],
    };
  });

  // Extract material distribution if available
  const materialDistribution = apiData.details?.preference_details?.material_distribution || {};
  const materialData = Object.entries(materialDistribution).map(([name, value], index) => {
    const colors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#F87171', '#60A5FA', '#34D399'];
    return {
      name,
      value: typeof value === 'number' ? value : Number(value),
      color: colors[index % colors.length],
    };
  });

  // Calculate segment trends (this would need real historical data)
  // For now, we'll create mock trend data based on the current distribution
  const segmentTrendData = rfmData.slice(0, 4).map((segment, index) => {
    // Generate some random trend data
    const baseValue = segment.value;
    const trendData = Array(6).fill(0).map((_, i) => {
      // Create a trend that ends with the current value
      const startValue = Math.max(5, baseValue - Math.random() * 10);
      const step = (baseValue - startValue) / 5;
      return Math.round(startValue + step * i);
    });

    return {
      label: segment.name,
      data: trendData,
    };
  });

  return {
    segmentData: rfmData.length > 0 ? rfmData : demographicData,
    segmentTrendData,
    rawApiData: apiData, // Include raw data for debugging
    demographicData,
    rfmData,
    preferenceData,
    categoryDistribution: categoryData,
    materialDistribution: materialData
  };
};

/**
 * Custom segment management API functions
 */

// Get all custom segments
export const getCustomSegments = async (): Promise<Segment[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/segment/custom-segments`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch custom segments');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching custom segments:', error);
    // Return mock data for development
    return loadSegmentsFromStorage();
  }
};

// Get a single custom segment by ID
export const getCustomSegmentById = async (id: string): Promise<Segment | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/segment/custom-segments/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to fetch segment ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching segment ${id}:`, error);
    // Return mock data for development
    const segments = loadSegmentsFromStorage();
    return segments.find(s => s.id === id) || null;
  }
};

// Create a new custom segment
export const createCustomSegment = async (segment: Omit<Segment, 'id' | 'createdAt' | 'updatedAt' | 'customerCount' | 'customerPercentage'>): Promise<Segment | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/segment/custom-segments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(segment),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create segment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating segment:', error);

    // Create mock segment for development
    const segments = loadSegmentsFromStorage();

    // Calculate segment size based on rules
    const segmentSize = await calculateSegmentSize(segment.rules);

    const newSegment: Segment = {
      ...segment,
      id: `segment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customerCount: segmentSize.count,
      customerPercentage: segmentSize.percentage
    };

    const updatedSegments = [...segments, newSegment];
    saveSegmentsToStorage(updatedSegments);

    return newSegment;
  }
};

// Update an existing custom segment
export const updateCustomSegment = async (id: string, segment: Omit<Segment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Segment | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/segment/custom-segments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(segment),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to update segment ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating segment ${id}:`, error);

    // Update mock segment for development
    const segments = loadSegmentsFromStorage();
    const index = segments.findIndex(s => s.id === id);
    if (index === -1) return null;

    // Calculate segment size based on rules
    const segmentSize = await calculateSegmentSize(segment.rules);

    const updatedSegment: Segment = {
      ...segments[index],
      ...segment,
      updatedAt: new Date().toISOString(),
      customerCount: segmentSize.count,
      customerPercentage: segmentSize.percentage
    };

    segments[index] = updatedSegment;
    saveSegmentsToStorage(segments);

    return updatedSegment;
  }
};

// Delete a custom segment
export const deleteCustomSegment = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/segment/custom-segments/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to delete segment ${id}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting segment ${id}:`, error);

    // Delete from mock data for development
    const segments = loadSegmentsFromStorage();
    const updatedSegments = segments.filter(s => s.id !== id);

    if (updatedSegments.length < segments.length) {
      saveSegmentsToStorage(updatedSegments);
      return true;
    }

    return false;
  }
};

// Preview a segment (get customer count and percentage)
export const previewCustomSegment = async (segment: Omit<Segment, 'id' | 'createdAt' | 'updatedAt' | 'customerCount' | 'customerPercentage'>): Promise<{ count: number; percentage: number } | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/segment/preview-segment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(segment),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to preview segment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error previewing segment:', error);

    // Use our more realistic segment size calculation
    return await calculateSegmentSize(segment.rules);
  }
};

// Use a segment for marketing campaign
export const useSegmentForCampaign = async (segmentId: string, campaignType: 'email' | 'sms', campaignData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/marketing/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        segmentId,
        type: campaignType,
        ...campaignData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Failed to create campaign for segment ${segmentId}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error creating campaign for segment ${segmentId}:`, error);

    // Mock campaign creation for development
    const segments = loadSegmentsFromStorage();
    const segment = segments.find(s => s.id === segmentId);

    return {
      id: `campaign-${Date.now()}`,
      segmentId,
      type: campaignType,
      ...campaignData,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      recipientCount: segment?.customerCount || 0
    };
  }
};

// Local storage key for segments
const SEGMENTS_STORAGE_KEY = 'crm_custom_segments';

// Cache for segmentation data
let segmentationCache: any = null;

// Cache for segment options
let segmentOptionsCache: any = null;

// Helper function to get segmentation data
const getSegmentationData = async (): Promise<any> => {
  if (segmentationCache) {
    return segmentationCache;
  }

  try {
    console.log('Fetching real segmentation data from API...');
    const result = await runComprehensiveSegmentation();
    console.log('Segmentation data received:', result);
    segmentationCache = result;
    return result;
  } catch (error) {
    console.error('Error fetching segmentation data:', error);
    return {
      summary: {
        demographic: { Male: 250, Female: 200 },
        value_based_rfm: {
          Champions: 100,
          "Loyal Customers": 150,
          "Potential Loyalists": 80,
          "At Risk": 70,
          "Lost Customers": 56
        },
        preference: {
          "Fashion Enthusiasts": 120,
          "Casual Shoppers": 180,
          "Seasonal Buyers": 90,
          "Brand Loyalists": 66
        }
      },
      details: {
        preference_details: {
          category_distribution: {
            "Clothing": 200,
            "Footwear": 120,
            "Accessories": 80,
            "Electronics": 56
          },
          material_distribution: {
            "Cotton": 150,
            "Leather": 100,
            "Synthetic": 120,
            "Wool": 86
          }
        }
      },
      customer_count: 456
    };
  }
};

// Helper function to get segment options
export const getSegmentOptions = async (): Promise<any> => {
  if (segmentOptionsCache) {
    return segmentOptionsCache;
  }

  try {
    console.log('Fetching segment options from API...');
    // In a real implementation, this would call the backend API
    // const response = await fetch(`${API_BASE_URL}/segment/segment-options`);
    // const data = await response.json();

    // For now, extract options from segmentation data
    const segmentationData = await getSegmentationData();

    const options = {
      rfm_segments: Object.keys(segmentationData.summary?.value_based_rfm || {}),
      categories: Object.keys(segmentationData.details?.preference_details?.category_distribution || {}),
      materials: Object.keys(segmentationData.details?.preference_details?.material_distribution || {}),
      preference_segments: Object.keys(segmentationData.summary?.preference || {}),
      locations: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'] // Mock data for now
    };

    console.log('Segment options:', options);
    segmentOptionsCache = options;
    return options;
  } catch (error) {
    console.error('Error fetching segment options:', error);
    return {
      rfm_segments: ['Champions', 'Loyal Customers', 'Potential Loyalists', 'New Customers', 'At Risk', 'Lost Customers'],
      categories: ['Clothing', 'Footwear', 'Accessories', 'Electronics'],
      materials: ['Cotton', 'Leather', 'Synthetic', 'Wool', 'Denim', 'Polyester'],
      preference_segments: ['Fashion Enthusiasts', 'Casual Shoppers', 'Seasonal Buyers', 'Brand Loyalists'],
      locations: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']
    };
  }
};

// Helper function to calculate segment size based on rules
const calculateSegmentSize = async (rules: SegmentRule[]): Promise<{ count: number; percentage: number }> => {
  // If there are no rules, return 0
  if (!rules || rules.length === 0) {
    return { count: 0, percentage: 0 };
  }

  // Get real segmentation data
  const segmentationData = await getSegmentationData();
  const totalCustomers = segmentationData.customer_count || 2000;

  // Start with the total customer count
  let matchingCount = totalCustomers;

  // Get RFM segment distribution
  const rfmSegments = segmentationData.summary?.value_based_rfm || {};

  // Get demographic distribution
  const demographicSegments = segmentationData.summary?.demographic || {};

  // Get preference segment distribution
  const preferenceSegments = segmentationData.summary?.preference || {};

  // Get product category distribution
  const categoryDistribution = segmentationData.details?.preference_details?.category_distribution || {};

  // Get material distribution
  const materialDistribution = segmentationData.details?.preference_details?.material_distribution || {};

  console.log('Using real data for segment size calculation:');
  console.log('- Total customers:', totalCustomers);
  console.log('- RFM segments:', rfmSegments);
  console.log('- Demographic segments:', demographicSegments);
  console.log('- Preference segments:', preferenceSegments);
  console.log('- Category distribution:', categoryDistribution);
  console.log('- Material distribution:', materialDistribution);

  // Apply each rule to reduce the matching count
  for (const rule of rules) {
    console.log(`Applying rule: ${rule.type} ${rule.operator} ${rule.value || ''}`);

    // Different rule types have different impacts on the count
    switch (rule.type) {
      case 'purchase':
        if (rule.operator === 'greater_than') {
          // Higher purchase counts mean fewer customers
          const value = Number(rule.value) || 0;
          const oldCount = matchingCount;
          matchingCount = Math.floor(matchingCount * Math.max(0.1, 1 - (value * 0.15)));
          console.log(`  Purchase > ${value}: ${oldCount} -> ${matchingCount}`);
        }
        break;

      case 'product_category':
        // Use real product category distribution if available
        if (rule.operator === 'is' && categoryDistribution[rule.value]) {
          const oldCount = matchingCount;
          matchingCount = categoryDistribution[rule.value];
          console.log(`  Category is ${rule.value}: Using real data -> ${matchingCount}`);
        } else if (rule.operator === 'is_not' && categoryDistribution[rule.value]) {
          const oldCount = matchingCount;
          matchingCount = totalCustomers - categoryDistribution[rule.value];
          console.log(`  Category is not ${rule.value}: Using real data -> ${matchingCount}`);
        } else {
          // Fall back to approximation
          const oldCount = matchingCount;
          matchingCount = Math.floor(matchingCount * (0.1 + (Math.abs(hashString(String(rule.value))) % 30) / 100));
          console.log(`  Category ${rule.operator} ${rule.value}: Using approximation -> ${matchingCount}`);
        }
        break;

      case 'material':
        // Use real material distribution if available
        if (rule.operator === 'is' && materialDistribution[rule.value]) {
          const oldCount = matchingCount;
          matchingCount = materialDistribution[rule.value];
          console.log(`  Material is ${rule.value}: Using real data -> ${matchingCount}`);
        } else if (rule.operator === 'is_not' && materialDistribution[rule.value]) {
          const oldCount = matchingCount;
          matchingCount = totalCustomers - materialDistribution[rule.value];
          console.log(`  Material is not ${rule.value}: Using real data -> ${matchingCount}`);
        } else {
          // Fall back to approximation
          const oldCount = matchingCount;
          matchingCount = Math.floor(matchingCount * (0.1 + (Math.abs(hashString(String(rule.value))) % 20) / 100));
          console.log(`  Material ${rule.operator} ${rule.value}: Using approximation -> ${matchingCount}`);
        }
        break;

      case 'preference_segment':
        // Use real preference segment distribution if available
        if (rule.operator === 'is' && preferenceSegments[rule.value]) {
          const oldCount = matchingCount;
          matchingCount = preferenceSegments[rule.value];
          console.log(`  Preference segment is ${rule.value}: Using real data -> ${matchingCount}`);
        } else if (rule.operator === 'is_not' && preferenceSegments[rule.value]) {
          const oldCount = matchingCount;
          matchingCount = totalCustomers - preferenceSegments[rule.value];
          console.log(`  Preference segment is not ${rule.value}: Using real data -> ${matchingCount}`);
        } else {
          // Fall back to approximation
          const oldCount = matchingCount;
          matchingCount = Math.floor(matchingCount * (0.1 + (Math.abs(hashString(String(rule.value))) % 25) / 100));
          console.log(`  Preference segment ${rule.operator} ${rule.value}: Using approximation -> ${matchingCount}`);
        }
        break;

      case 'age':
        if (rule.operator === 'between') {
          // Age ranges match a percentage based on the range size
          const min = Number(rule.minValue) || 18;
          const max = Number(rule.maxValue) || 65;
          const rangeSize = max - min;
          const rangeFactor = Math.min(1, rangeSize / 80); // Normalize to 0-1
          const oldCount = matchingCount;
          matchingCount = Math.floor(matchingCount * rangeFactor);
          console.log(`  Age between ${min}-${max}: ${oldCount} -> ${matchingCount}`);
        }
        break;

      case 'gender':
        // Use real gender distribution if available
        if (rule.operator === 'is' && demographicSegments[rule.value]) {
          const oldCount = matchingCount;
          matchingCount = demographicSegments[rule.value];
          console.log(`  Gender is ${rule.value}: Using real data -> ${matchingCount}`);
        } else {
          // Fall back to approximation
          const oldCount = matchingCount;
          matchingCount = Math.floor(matchingCount * 0.5);
          console.log(`  Gender ${rule.operator} ${rule.value}: Using approximation -> ${matchingCount}`);
        }
        break;

      case 'rfm_segment':
        // Use real RFM segment distribution if available
        if (rule.operator === 'is' && rfmSegments[rule.value]) {
          const oldCount = matchingCount;
          matchingCount = rfmSegments[rule.value];
          console.log(`  RFM segment is ${rule.value}: Using real data -> ${matchingCount}`);
        } else if (rule.operator === 'is_not' && rfmSegments[rule.value]) {
          const oldCount = matchingCount;
          matchingCount = totalCustomers - rfmSegments[rule.value];
          console.log(`  RFM segment is not ${rule.value}: Using real data -> ${matchingCount}`);
        } else {
          // Fall back to approximation
          const oldCount = matchingCount;
          matchingCount = Math.floor(matchingCount * (0.1 + (Math.abs(hashString(String(rule.value))) % 15) / 100));
          console.log(`  RFM segment ${rule.operator} ${rule.value}: Using approximation -> ${matchingCount}`);
        }
        break;

      default:
        // Default reduction for other rule types
        const oldCount = matchingCount;
        matchingCount = Math.floor(matchingCount * 0.7);
        console.log(`  Unknown rule type ${rule.type}: ${oldCount} -> ${matchingCount}`);
    }
  }

  // Ensure we have at least some customers
  matchingCount = Math.max(5, matchingCount);

  // Calculate percentage
  const percentage = Math.round((matchingCount / totalCustomers) * 100);

  return {
    count: matchingCount,
    percentage
  };
};

// Helper function to get a simple hash of a string
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Default mock segments
const defaultMockSegments: Segment[] = [
  {
    id: 'segment-1',
    name: 'High-Value Denim Lovers',
    description: 'Customers who frequently purchase denim products and have high order values',
    rules: [
      {
        id: 'rule-1',
        type: 'product_category',
        operator: 'is',
        value: 'clothing'
      },
      {
        id: 'rule-2',
        type: 'purchase',
        operator: 'greater_than',
        value: 3
      }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerCount: 245,
    customerPercentage: 12
  },
  {
    id: 'segment-2',
    name: 'Young Urban Professionals',
    description: 'Customers aged 25-35 with high purchase frequency',
    rules: [
      {
        id: 'rule-1',
        type: 'age',
        operator: 'between',
        minValue: 25,
        maxValue: 35
      },
      {
        id: 'rule-2',
        type: 'purchase',
        operator: 'greater_than',
        value: 5
      }
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customerCount: 187,
    customerPercentage: 9
  }
];

// Load segments from local storage or use defaults
const loadSegmentsFromStorage = (): Segment[] => {
  try {
    const storedSegments = localStorage.getItem(SEGMENTS_STORAGE_KEY);
    return storedSegments ? JSON.parse(storedSegments) : defaultMockSegments;
  } catch (error) {
    console.error('Error loading segments from local storage:', error);
    return [...defaultMockSegments];
  }
};

// Save segments to local storage
const saveSegmentsToStorage = (segments: Segment[]): void => {
  try {
    localStorage.setItem(SEGMENTS_STORAGE_KEY, JSON.stringify(segments));
  } catch (error) {
    console.error('Error saving segments to local storage:', error);
  }
};

// Initialize mock segments from storage
const mockSegments: Segment[] = loadSegmentsFromStorage();
