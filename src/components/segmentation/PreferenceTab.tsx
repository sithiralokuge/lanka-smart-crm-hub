import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { Badge } from '@/components/ui/badge'
import { InfoCircledIcon, StarIcon } from '@radix-ui/react-icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function PreferenceTab({ preferenceData, categoryDistribution, materialDistribution, preferenceProfiles, preferenceDistribution }) {
  // Calculate total customers
  const totalCustomers = preferenceData.reduce((sum, item) => sum + item.value, 0)

  // Find top category and material
  const topCategory = categoryDistribution && categoryDistribution.length > 0 ?
    categoryDistribution.reduce(
      (max, item) => (item.value > max.value ? item : max),
      { name: '', value: 0 }
    ) : { name: 'N/A', value: 0 };

  const topMaterial = materialDistribution && materialDistribution.length > 0 ?
    materialDistribution.reduce(
      (max, item) => (item.value > max.value ? item : max),
      { name: '', value: 0 }
    ) : { name: 'N/A', value: 0 };

  return (
    <div className="space-y-6">
      {/* Key Insights Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Customer Preference Insights
            <Badge variant="outline" className="ml-2">Customer Tastes</Badge>
          </CardTitle>
          <CardDescription>
            What your customers like and prefer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-muted-foreground">Most Popular Category</h3>
                <StarIcon className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold mt-2">{topCategory.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Preferred by {Math.round((topCategory.value / totalCustomers) * 100)}% of customers
              </p>
              <div className="w-full bg-background rounded-full h-2 mt-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(topCategory.value / totalCustomers) * 100}%`,
                    backgroundColor: topCategory.color
                  }}
                />
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-muted-foreground">Favorite Material</h3>
                <StarIcon className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold mt-2">{topMaterial.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Preferred by {Math.round((topMaterial.value / totalCustomers) * 100)}% of customers
              </p>
              <div className="w-full bg-background rounded-full h-2 mt-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(topMaterial.value / totalCustomers) * 100}%`,
                    backgroundColor: topMaterial.color
                  }}
                />
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium text-muted-foreground">Preference Groups</h3>
                <StarIcon className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold mt-2">{preferenceData.length}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Distinct customer preference profiles
              </p>
              <div className="flex mt-2 gap-1">
                {preferenceData.map((group, index) => (
                  <div
                    key={index}
                    className="h-2 rounded-full"
                    style={{
                      width: `${(group.value / totalCustomers) * 100}%`,
                      backgroundColor: group.color
                    }}
                    title={`${group.name}: ${group.value} customers`}
                  />
                ))}
              </div>
            </div>
          </div>


        </CardContent>
      </Card>

      {/* Category Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Product Category Preferences</CardTitle>
          <CardDescription>
            What types of products your customers prefer
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
                        {categoryDistribution && categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-medium mb-4">Top Categories</h3>
                  <div className="space-y-4">
                    {categoryDistribution && categoryDistribution.slice(0, 5).map((category) => (
                      <div key={category.name} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                            <div className="font-medium">{category.name}</div>
                          </div>
                          <div className="font-medium">{category.value} customers</div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(category.value / totalCustomers) * 100}%`,
                              backgroundColor: category.color
                            }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          {Math.round((category.value / totalCustomers) * 100)}% of customers
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
                      <th className="text-left py-2">Category</th>
                      <th className="text-right py-2">Customer Count</th>
                      <th className="text-right py-2">Percentage</th>
                      <th className="text-left py-2">Popularity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryDistribution && categoryDistribution.map((category) => (
                      <tr key={category.name} className="border-b">
                        <td className="py-3 font-medium">{category.name}</td>
                        <td className="text-right py-3">{category.value.toLocaleString()}</td>
                        <td className="text-right py-3">
                          {Math.round((category.value / totalCustomers) * 100)}%
                        </td>
                        <td className="py-3">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${(category.value / totalCustomers) * 100}%`,
                                backgroundColor: category.color
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

      {/* Material Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Material Preferences</CardTitle>
          <CardDescription>
            What materials your customers prefer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={materialDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
                  <Bar dataKey="value" name="Customers" radius={[0, 4, 4, 0]}>
                    {materialDistribution && materialDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="text-lg font-medium mb-4">Material Insights</h3>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm">Top Material:</h4>
                  <p className="text-sm mt-1">
                    <span className="font-bold">{topMaterial.name}</span> is preferred by {Math.round((topMaterial.value / totalCustomers) * 100)}% of your customers, making it your most popular material.
                  </p>
                </div>


              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preference Group Profiles */}
      <Card>
        <CardHeader>
          <CardTitle>Preference Group Profiles</CardTitle>
          <CardDescription>
            Common characteristics of each preference group
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Group</th>
                  <th className="text-right py-2">Size</th>
                  <th className="text-left py-2">Favorite Category</th>
                  <th className="text-left py-2">Preferred Material</th>

                </tr>
              </thead>
              <tbody>
                {preferenceProfiles && Object.entries(preferenceProfiles).map(([group, profile]: [string, any]) => (
                  <tr key={group} className="border-b">
                    <td className="py-3 font-medium">{group}</td>
                    <td className="text-right py-3">
                      {preferenceDistribution?.[group] || 0} customers
                      <div className="text-xs text-muted-foreground">
                        ({Math.round(((preferenceDistribution?.[group] || 0) / totalCustomers) * 100)}%)
                      </div>
                    </td>
                    <td className="py-3">{profile?.favorite_category || 'N/A'}</td>
                    <td className="py-3">{profile?.preferred_material || 'N/A'}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
