/**
 * API service for segmentation operations
 */

// Using Vite's proxy feature to avoid CORS issues in development
const API_BASE_URL = '/api';

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
  };
};
