import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  runComprehensiveSegmentation,
  runSpecificSegmentation,
  transformSegmentationData
} from './segmentationApi';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { monthLabels } from "@/data/mockData";

const SegmentationVisualizer = () => {
  const [activeTab, setActiveTab] = useState('value');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [segmentationData, setSegmentationData] = useState<any>(null);

  // Function to run segmentation
  const runSegmentation = async (type: 'comprehensive' | 'demographic' | 'preference' | 'rfm') => {
    setIsLoading(true);
    setError(null);

    try {
      let result;

      if (type === 'comprehensive') {
        result = await runComprehensiveSegmentation();
      } else {
        result = await runSpecificSegmentation(type);
      }

      // Transform the data for visualization
      const transformedData = transformSegmentationData(result);
      setSegmentationData(transformedData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while running segmentation');
    } finally {
      setIsLoading(false);
    }
  };

  // Run comprehensive segmentation on component mount
  useEffect(() => {
    runSegmentation('comprehensive');
  }, []);

  // Render loading state
  if (isLoading && !segmentationData) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Running customer segmentation analysis...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Segmentation Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting Steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Please check the following:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Is the segmentation server running? Run <code>start_segmentation_server.bat</code></li>
              <li>Is MongoDB running and accessible?</li>
              <li>Are there customer records in the MongoDB database?</li>
              <li>Check the browser console (F12) for more detailed error messages</li>
            </ol>
            <div className="mt-4">
              <Button
                onClick={() => runSegmentation('comprehensive')}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract data for visualization
  const {
    segmentData,
    segmentTrendData,
    rawApiData,
    demographicData,
    rfmData,
    preferenceData,
    categoryDistribution,
    materialDistribution
  } = segmentationData || {
    segmentData: [],
    segmentTrendData: [],
    rawApiData: {},
    demographicData: [],
    rfmData: [],
    preferenceData: [],
    categoryDistribution: [],
    materialDistribution: []
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Segmentation</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => runSegmentation('comprehensive')}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Refresh All Segments
          </Button>
        </div>
      </div>

      <Tabs defaultValue="value" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="value" onClick={() => runSegmentation('rfm')}>
            Value-Based (RFM)
          </TabsTrigger>
          <TabsTrigger value="demographic" onClick={() => runSegmentation('demographic')}>
            Demographic
          </TabsTrigger>
          <TabsTrigger value="preference" onClick={() => runSegmentation('preference')}>
            Preference-Based
          </TabsTrigger>
        </TabsList>

        <TabsContent value="value" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Value Segments Distribution</CardTitle>
                <CardDescription>Customer distribution by value segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Pie
                        data={segmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {segmentData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {segmentData.map((segment: any) => (
                    <div key={segment.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                      <div className="text-sm">{segment.name}: {segment.value}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segment Trends</CardTitle>
                <CardDescription>How segments have changed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={monthLabels.map((month, i) => {
                      const dataPoint: any = { name: month };
                      segmentTrendData.forEach((segment: any) => {
                        dataPoint[segment.label] = segment.data[i];
                      });
                      return dataPoint;
                    })}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {segmentTrendData.map((segment: any, index: number) => (
                        <Line
                          key={segment.label}
                          type="monotone"
                          dataKey={segment.label}
                          stroke={['#8B5CF6', '#A78BFA', '#C4B5FD', '#F87171'][index % 4]}
                          strokeWidth={2}
                        />
                      ))}
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RFM Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>RFM Segment Details</CardTitle>
              <CardDescription>Average metrics for each segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Segment</th>
                      <th className="text-right py-2">Count</th>
                      <th className="text-right py-2">Avg. Recency (days)</th>
                      <th className="text-right py-2">Avg. Frequency</th>
                      <th className="text-right py-2">Avg. Monetary (LKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(rawApiData?.details?.value_based_rfm_details?.avg_values || {}).map(([segment, values]: [string, any]) => (
                      <tr key={segment} className="border-b">
                        <td className="py-2">{segment}</td>
                        <td className="text-right py-2">{rawApiData?.details?.value_based_rfm_details?.distribution?.[segment] || 0}</td>
                        <td className="text-right py-2">{values?.recency?.toFixed(1) || 'N/A'}</td>
                        <td className="text-right py-2">{values?.frequency?.toFixed(1) || 'N/A'}</td>
                        <td className="text-right py-2">{values?.monetary?.toLocaleString() || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographic" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gender Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Customer distribution by gender</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                      <Pie
                        data={demographicData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {demographicData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {demographicData.map((segment: any) => (
                    <div key={segment.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                      <div className="text-sm">{segment.name}: {segment.value} customers</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Demographic Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Demographic Insights</CardTitle>
                <CardDescription>Key insights from demographic segmentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Summary</h3>
                    <p className="text-sm text-muted-foreground">
                      {demographicData.length > 0
                        ? `Customers have been segmented into ${demographicData.length} demographic groups based on gender.`
                        : 'No demographic data available for segmentation.'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Gender Breakdown</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      {demographicData.map((segment) => (
                        <div key={segment.name} className="bg-muted rounded-md p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                            <div className="font-medium">{segment.name}</div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{segment.value} customers</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Recommendations</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Consider gender-specific marketing campaigns</li>
                      <li>Develop products that appeal to your largest demographic segments</li>
                      <li>Analyze purchasing patterns by gender to identify trends</li>
                      <li>Target underrepresented demographics to expand your customer base</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preference" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preference Groups Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Preference Groups</CardTitle>
                <CardDescription>Customer clusters based on preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                      <Pie
                        data={preferenceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {preferenceData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {preferenceData.map((segment: any) => (
                    <div key={segment.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                      <div className="text-sm">{segment.name}: {segment.value} customers</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Favorite Categories Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Favorite Categories</CardTitle>
                <CardDescription>Distribution of customer preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {categoryDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {categoryDistribution.map((category: any) => (
                    <div key={category.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                      <div className="text-sm">{category.name}: {category.value} customers</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preferred Materials Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Preferred Materials</CardTitle>
                <CardDescription>Distribution of material preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                      <Pie
                        data={materialDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {materialDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {materialDistribution.map((material: any) => (
                    <div key={material.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: material.color }}></div>
                      <div className="text-sm">{material.name}: {material.value} customers</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preference Profiles Card */}
            <Card>
              <CardHeader>
                <CardTitle>Preference Group Profiles</CardTitle>
                <CardDescription>Common characteristics of each preference group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Group</th>
                        <th className="text-right py-2">Count</th>
                        <th className="text-left py-2">Favorite Category</th>
                        <th className="text-left py-2">Preferred Material</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(rawApiData?.details?.preference_details?.profiles || {}).map(([group, profile]: [string, any]) => (
                        <tr key={group} className="border-b">
                          <td className="py-2">{group}</td>
                          <td className="text-right py-2">{rawApiData?.details?.preference_details?.distribution?.[group] || 0}</td>
                          <td className="py-2">{profile?.favorite_category || 'N/A'}</td>
                          <td className="py-2">{profile?.preferred_material || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preference Insights Card */}
          <Card>
            <CardHeader>
              <CardTitle>Preference Insights</CardTitle>
              <CardDescription>Key insights from preference segmentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    {preferenceData.length > 0
                      ? `Customers have been segmented into ${preferenceData.length} preference groups based on their favorite categories and preferred materials.`
                      : 'No preference data available for segmentation.'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Popular Categories</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {categoryDistribution.slice(0, 3).map((category) => (
                      <div key={category.name} className="bg-muted rounded-md p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                          <div className="font-medium">{category.name}</div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{category.value} customers</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Popular Materials</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {materialDistribution.slice(0, 3).map((material) => (
                      <div key={material.name} className="bg-muted rounded-md p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: material.color }}></div>
                          <div className="font-medium">{material.name}</div>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{material.value} customers</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Consider creating targeted marketing campaigns for each preference group</li>
                    <li>Stock inventory based on popular material preferences</li>
                    <li>Develop product lines that align with favorite categories</li>
                    <li>Use preference data to personalize customer communications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SegmentationVisualizer;
