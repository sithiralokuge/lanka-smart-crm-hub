
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3, PieChart, LineChart, Calendar, Download, Filter } from "lucide-react";
import {
  LineChart as ReLineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { segmentData, revenueData, customerGrowthData, segmentTrendData, monthLabels } from "@/data/mockData";
import SegmentationVisualizer from "@/components/segmentation/SegmentationVisualizer";

const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Comprehensive data analysis and reporting.</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Last 30 Days</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </div>
              <Button variant="outline" size="icon">
                <LineChart className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={monthLabels.map((month, i) => ({ name: month, revenue: revenueData.data[i] }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `Rs ${value/1000}k`} />
                  <Tooltip formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Revenue']} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#7E69AB" strokeWidth={2} activeDot={{ r: 8 }} />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Distribution by value</CardDescription>
              </div>
              <Button variant="outline" size="icon">
                <PieChart className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[230px]">
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
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {segmentData.map((segment) => (
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>New customers per month</CardDescription>
              </div>
              <Button variant="outline" size="icon">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={monthLabels.map((month, i) => ({ name: month, customers: customerGrowthData.data[i] }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="customers" name="New Customers" fill="#7E69AB" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Segment Trend Analysis</CardTitle>
                <CardDescription>How segments have changed over time</CardDescription>
              </div>
              <Button variant="outline" size="icon">
                <LineChart className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={monthLabels.map((month, i) => ({
                  name: month,
                  highValue: segmentTrendData[0].data[i],
                  mediumValue: segmentTrendData[1].data[i],
                  lowValue: segmentTrendData[2].data[i],
                  atRisk: segmentTrendData[3].data[i],
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="highValue" name="High Value" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="mediumValue" name="Medium Value" stroke="#A78BFA" strokeWidth={2} />
                  <Line type="monotone" dataKey="lowValue" name="Low Value" stroke="#C4B5FD" strokeWidth={2} />
                  <Line type="monotone" dataKey="atRisk" name="At Risk" stroke="#F87171" strokeWidth={2} />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {activeTab === "segmentation" && (
        <SegmentationVisualizer />
      )}
    </div>
  );
};

export default AnalyticsPage;
