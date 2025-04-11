
import { ArrowDown, ArrowUp, TrendingUp, Users, DollarSign, BarChart2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardMetrics, segmentData, revenueData, customerGrowthData, monthLabels } from "@/data/mockData";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const DashboardPage = () => {
  const formatCurrency = (value: number) => {
    return `Rs. ${value.toLocaleString('en-LK')}`;
  };
  
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, Asela</h1>
        <p className="text-muted-foreground">Here's what's happening with your customer data today.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dashboardMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                  <h2 className="text-3xl font-bold mt-1">
                    {metric.name.includes("Value") ? formatCurrency(metric.value) : 
                     metric.name.includes("Rate") ? `${metric.value}%` : 
                     metric.value.toLocaleString()}
                  </h2>
                </div>
                <div className={`p-2 rounded-full ${
                  metric.trend === "up" ? "bg-green-100 text-green-700" : 
                  metric.trend === "down" && metric.name.includes("Churn") ? "bg-green-100 text-green-700" :
                  metric.trend === "down" ? "bg-red-100 text-red-700" : 
                  "bg-gray-100 text-gray-700"
                }`}>
                  {metric.trend === "up" ? <TrendingUp className="h-5 w-5" /> : 
                   metric.trend === "down" ? <ArrowDown className="h-5 w-5" /> : 
                   <BarChart2 className="h-5 w-5" />}
                </div>
              </div>
              <div className="flex items-center mt-3">
                <span className={`text-sm font-medium ${
                  metric.trend === "up" && !metric.name.includes("Churn") ? "text-green-600" : 
                  metric.trend === "down" && metric.name.includes("Churn") ? "text-green-600" :
                  metric.trend === "down" ? "text-red-600" : 
                  "text-gray-600"
                }`}>
                  {metric.change}%
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  {metric.trend === "up" ? "increase" : 
                   metric.trend === "down" ? "decrease" : 
                   "no change"} from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue for the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthLabels.map((month, i) => ({ name: month, value: revenueData.data[i] }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `Rs ${value/1000}k`} />
                  <Tooltip formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#7E69AB" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Customer Growth</CardTitle>
              <CardDescription>New customers over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthLabels.map((month, i) => ({ name: month, value: customerGrowthData.data[i] }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="New Customers" fill="#7E69AB" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="segments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Distribution of customer segments</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
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
                      {segmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Segment Details</CardTitle>
                <CardDescription>Key metrics for each segment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {segmentData.map((segment) => (
                    <div key={segment.name} className="flex items-center">
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: segment.color }}></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{segment.name}</span>
                          <span>{segment.value}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ width: `${segment.value}%`, backgroundColor: segment.color }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-crm-purple mr-2" />
                      <span>Total Customers</span>
                    </div>
                    <span className="font-bold">1,856</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-crm-purple mr-2" />
                      <span>Avg. CLV</span>
                    </div>
                    <span className="font-bold">Rs. 45,300</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
