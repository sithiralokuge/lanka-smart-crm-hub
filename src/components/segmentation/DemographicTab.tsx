import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function DemographicTab({ demographicData }) {
  // Generate mock age data (will be replaced with real data in the future)
  const ageData = [
    { name: 'Under 18', value: 42, color: '#8B5CF6' },
    { name: '18-24', value: 120, color: '#A78BFA' },
    { name: '25-34', value: 235, color: '#C4B5FD' },
    { name: '35-44', value: 180, color: '#F87171' },
    { name: '45-54', value: 98, color: '#60A5FA' },
    { name: '55+', value: 75, color: '#34D399' },
  ]

  // Calculate total customers
  const totalCustomers = demographicData.reduce((sum, item) => sum + item.value, 0)

  // Find dominant gender
  const dominantGender = demographicData.reduce(
    (max, item) => (item.value > max.value ? item : max),
    { name: '', value: 0 }
  )

  // Calculate gender percentages
  const genderPercentages = demographicData.map(item => ({
    ...item,
    percentage: Math.round((item.value / totalCustomers) * 100)
  }))

  return (
    <div className="space-y-6">
      {/* Key Insights Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Key Demographic Insights
            <Badge variant="outline" className="ml-2">At a Glance</Badge>
          </CardTitle>
          <CardDescription>
            Simple breakdown of your customer demographics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Customers</h3>
              <p className="text-3xl font-bold">{totalCustomers.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">across all segments</p>
            </div>

            <div className="bg-muted rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Dominant Gender</h3>
              <p className="text-3xl font-bold">{dominantGender.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {dominantGender.percentage}% of your customer base
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4 text-center">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Gender Balance</h3>
              <div className="flex justify-center items-center h-10 mt-2">
                {genderPercentages.map((item) => (
                  <div
                    key={item.name}
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                      height: '100%'
                    }}
                    className="first:rounded-l-md last:rounded-r-md"
                    title={`${item.name}: ${item.percentage}%`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>


        </CardContent>
      </Card>

      {/* Gender Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
          <CardDescription>
            Breakdown of customers by gender identity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
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
                        {demographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-medium mb-4">Gender Breakdown</h3>
                  <div className="space-y-4">
                    {demographicData.map((segment) => (
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
                          {Math.round((segment.value / totalCustomers) * 100)}% of total
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
                      <th className="text-left py-2">Gender</th>
                      <th className="text-right py-2">Count</th>
                      <th className="text-right py-2">Percentage</th>
                      <th className="text-left py-2">Visualization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demographicData.map((segment) => (
                      <tr key={segment.name} className="border-b">
                        <td className="py-3 font-medium">{segment.name}</td>
                        <td className="text-right py-3">{segment.value.toLocaleString()}</td>
                        <td className="text-right py-3">
                          {Math.round((segment.value / totalCustomers) * 100)}%
                        </td>
                        <td className="py-3">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${(segment.value / totalCustomers) * 100}%`,
                                backgroundColor: segment.color
                              }}
                            />
                          </div>
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

      {/* Age Distribution (Placeholder) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Age Distribution</CardTitle>
              <CardDescription>
                Breakdown of customers by age group
              </CardDescription>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                  <Legend />
                  <Bar dataKey="value" name="Customers" radius={[4, 4, 0, 0]}>
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-medium mb-4">Age Insights</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Primary age group:</span> 25-34 years (35% of customers)
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Secondary age group:</span> 35-44 years (24% of customers)
                </p>
              </div>


            </div>
          </div>

          <div className="mt-6 p-4 border border-dashed rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <InfoCircledIcon className="h-5 w-5 text-amber-500" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Note:</span> This visualization uses sample data. Connect your customer age data to see actual age distribution.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
