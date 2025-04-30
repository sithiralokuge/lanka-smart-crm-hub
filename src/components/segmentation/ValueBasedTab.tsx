import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { InfoCircledIcon, StarIcon, PersonIcon } from '@radix-ui/react-icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

export function ValueBasedTab({ rfmData, avgValues }) {
  // Calculate total customers
  const totalCustomers = rfmData.reduce((sum, item) => sum + item.value, 0)

  // Find top segment
  const topSegment = rfmData.reduce(
    (max, item) => (item.value > max.value ? item : max),
    { name: '', value: 0 }
  )

  // Group segments into categories
  const highValueSegments = ['Champions', 'Loyal Customers', 'Potential Loyalists']
  const atRiskSegments = ['At Risk (High Frequency)', 'At Risk (High Value)', 'Lost Customers']
  const newSegments = ['New Customers']

  // Calculate customers in each category
  const highValueCount = rfmData
    .filter(item => highValueSegments.includes(item.name))
    .reduce((sum, item) => sum + item.value, 0)

  const atRiskCount = rfmData
    .filter(item => atRiskSegments.includes(item.name))
    .reduce((sum, item) => sum + item.value, 0)

  const newCount = rfmData
    .filter(item => newSegments.includes(item.name))
    .reduce((sum, item) => sum + item.value, 0)

  // Calculate percentages
  const highValuePercentage = Math.round((highValueCount / totalCustomers) * 100)
  const atRiskPercentage = Math.round((atRiskCount / totalCustomers) * 100)
  const newPercentage = Math.round((newCount / totalCustomers) * 100)

  // Prepare radar chart data
  const radarData = avgValues ? Object.entries(avgValues).map(([segment, values]: [string, any]) => ({
    segment,
    recency: values.recency,
    frequency: values.frequency,
    monetary: values.monetary / 1000 // Scale down for better visualization
  })) : [];

  return (
    <div className="space-y-6">
      {/* Key Insights Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Customer Value Insights
            <Badge variant="outline" className="ml-2">Business Impact</Badge>
          </CardTitle>
          <CardDescription>
            Understanding your customer value segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-muted-foreground">High-Value Customers</h3>
                <StarIcon className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold mt-2">{highValueCount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {highValuePercentage}% of your customer base
              </p>
              <Progress value={highValuePercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                These customers are your most valuable assets and drive significant revenue.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-muted-foreground">At-Risk Customers</h3>
                <InfoCircledIcon className="h-5 w-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold mt-2">{atRiskCount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {atRiskPercentage}% of your customer base
              </p>
              <Progress value={atRiskPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                These customers need attention to prevent them from churning.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-muted-foreground">New Customers</h3>
                <PersonIcon className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold mt-2">{newCount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {newPercentage}% of your customer base
              </p>
              <Progress value={newPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                These customers are new to your business and have growth potential.
              </p>
            </div>
          </div>


        </CardContent>
      </Card>

      {/* Value Segment Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Value Segments</CardTitle>
          <CardDescription>
            How your customers are distributed across value segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Visual View</TabsTrigger>
              <TabsTrigger value="table">Detailed View</TabsTrigger>
            </TabsList>

            <TabsContent value="chart">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Tooltip
                        formatter={(value) => [`${value} customers (${Math.round((value/totalCustomers)*100)}%)`, 'Count']}
                        contentStyle={{ borderRadius: '8px' }}
                      />
                      <Pie
                        data={rfmData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {rfmData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-medium mb-4">Segment Breakdown</h3>
                  <div className="space-y-4">
                    {rfmData.slice(0, 5).map((segment) => (
                      <div key={segment.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                            <div className="font-medium">{segment.name}</div>
                          </div>
                          <div className="font-medium">{segment.value} customers</div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(segment.value / totalCustomers) * 100}%`,
                              backgroundColor: segment.color
                            }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          {Math.round((segment.value / totalCustomers) * 100)}% of customers
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="table">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Segment</th>
                      <th className="text-right py-2">Customer Count</th>
                      <th className="text-right py-2">Percentage</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rfmData.map((segment) => (
                      <tr key={segment.name} className="border-b">
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                            <span className="font-medium">{segment.name}</span>
                          </div>
                        </td>
                        <td className="text-right py-3">{segment.value.toLocaleString()}</td>
                        <td className="text-right py-3">
                          {Math.round((segment.value / totalCustomers) * 100)}%
                        </td>
                        <td className="py-3 text-sm">
                          {segment.name === 'Champions' && 'High spending, frequent customers who purchased recently'}
                          {segment.name === 'Loyal Customers' && 'Regular customers with consistent purchasing patterns'}
                          {segment.name === 'Potential Loyalists' && 'Recent customers with potential to become loyal'}
                          {segment.name === 'At Risk (High Frequency)' && 'Previously frequent customers who haven\'t purchased recently'}
                          {segment.name === 'At Risk (High Value)' && 'Previously high-value customers who haven\'t purchased recently'}
                          {segment.name === 'Lost Customers' && 'Customers who haven\'t purchased in a long time'}
                          {segment.name === 'New Customers' && 'Recent first-time customers'}
                          {segment.name === 'Regular Customers' && 'Average customers with moderate frequency and spending'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Segment Comparison */}
      {avgValues && Object.keys(avgValues).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Segment Comparison</CardTitle>
            <CardDescription>
              Compare key metrics across customer segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="segment" />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                    <Radar name="Recency (days)" dataKey="recency" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                    <Radar name="Frequency (orders)" dataKey="frequency" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
                    <Radar name="Monetary (thousands)" dataKey="monetary" stroke="#ffc658" fill="#ffc658" fillOpacity={0.2} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-medium mb-4">Segment Characteristics</h3>
                <div className="space-y-4">
                  {Object.entries(avgValues).slice(0, 4).map(([segment, values]: [string, any]) => (
                    <div key={segment} className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium">{segment}</h4>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Recency</p>
                          <p className="font-medium">{values.recency} days</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Frequency</p>
                          <p className="font-medium">{values.frequency} orders</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg. Spend</p>
                          <p className="font-medium">${values.monetary.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 border border-dashed rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <InfoCircledIcon className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">How to read this chart:</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <strong>Recency:</strong> Lower is better (fewer days since last purchase)<br />
                    <strong>Frequency:</strong> Higher is better (more purchases)<br />
                    <strong>Monetary:</strong> Higher is better (more spending)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}


    </div>
  )
}
