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
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to run segmentation');
      } catch (jsonError) {
        // If response is not valid JSON
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    }

    try {
      return await response.json();
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      throw new Error('Invalid response from segmentation server');
    }
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
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to run ${segmentType} segmentation`);
      } catch (jsonError) {
        // If response is not valid JSON
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    }

    try {
      return await response.json();
    } catch (jsonError) {
      console.error(`Failed to parse JSON response for ${segmentType} segmentation:`, jsonError);
      throw new Error('Invalid response from segmentation server');
    }
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
  // Define a consistent color palette
  const colors = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#F87171', '#60A5FA', '#34D399', '#10B981', '#FBBF24', '#EC4899'];

  // Transform demographic segmentation data
  const demographicSegments = apiData.summary?.demographic || {};
  const demographicData = Object.entries(demographicSegments).map(([name, value], index) => {
    return {
      name: name.replace('Gender_', ''), // Remove prefix if needed
      value: typeof value === 'number' ? value : Number(value),
      color: colors[index % colors.length],
    };
  });

  // Transform RFM segmentation data
  const rfmSegments = apiData.summary?.value_based_rfm || {};
  const rfmData = Object.entries(rfmSegments).map(([name, value], index) => {
    return {
      name,
      value: typeof value === 'number' ? value : Number(value),
      color: colors[index % colors.length],
    };
  });

  // Transform preference segmentation data
  const preferenceSegments = apiData.summary?.preference || {};
  const preferenceData = Object.entries(preferenceSegments).map(([name, value], index) => {
    return {
      name,
      value: typeof value === 'number' ? value : Number(value),
      color: colors[index % colors.length],
    };
  });

  // Extract preference profiles for detailed analysis
  const preferenceProfiles = apiData.details?.preference_details?.profiles || {};

  // Extract unique categories and materials from profiles
  const categories = new Set<string>();
  const materials = new Set<string>();

  Object.values(preferenceProfiles).forEach((profile: any) => {
    if (profile.favorite_category && profile.favorite_category !== 'N/A' && profile.favorite_category !== 'Unknown') {
      categories.add(profile.favorite_category);
    }
    if (profile.preferred_material && profile.preferred_material !== 'N/A' && profile.preferred_material !== 'Unknown') {
      materials.add(profile.preferred_material);
    }
  });

  // Create category and material distribution data
  const categoryDistribution = Array.from(categories).map((category, index) => {
    // Count customers with this category
    let count = 0;
    Object.entries(preferenceProfiles).forEach(([group, profile]: [string, any]) => {
      if (profile.favorite_category === category) {
        count += apiData.details?.preference_details?.distribution?.[group] || 0;
      }
    });

    return {
      name: category,
      value: count,
      color: colors[index % colors.length],
    };
  });

  const materialDistribution = Array.from(materials).map((material, index) => {
    // Count customers with this material
    let count = 0;
    Object.entries(preferenceProfiles).forEach(([group, profile]: [string, any]) => {
      if (profile.preferred_material === material) {
        count += apiData.details?.preference_details?.distribution?.[group] || 0;
      }
    });

    return {
      name: material,
      value: count,
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

  // Determine which data to use based on the active tab
  let segmentData;
  if (apiData.details?.value_based_rfm_details) {
    segmentData = rfmData;
  } else if (apiData.details?.preference_details) {
    segmentData = preferenceData;
  } else {
    segmentData = demographicData;
  }

  return {
    segmentData,
    demographicData,
    rfmData,
    preferenceData,
    categoryDistribution,
    materialDistribution,
    segmentTrendData,
    rawApiData: apiData, // Include raw data for debugging
  };
};
