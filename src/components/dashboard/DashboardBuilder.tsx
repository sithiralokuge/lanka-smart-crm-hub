import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, X, Save, Layout, Eye, Settings, ChevronDown } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { SegmentFilter } from './SegmentFilter'
import { VisualizationPicker } from './VisualizationPicker'
import { SegmentCombiner } from './SegmentCombiner'
import { DashboardItem } from './DashboardItem'

export function DashboardBuilder() {
  const [dashboardItems, setDashboardItems] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('build')
  const [savedDashboards, setSavedDashboards] = useState<any[]>([])
  
  // Add a new visualization to the dashboard
  const addVisualization = (type: string) => {
    setDashboardItems([
      ...dashboardItems,
      {
        id: `item-${Date.now()}`,
        type,
        title: type === 'segment' ? 'New Segment Visualization' : 
               type === 'combined' ? 'Combined Segments' : 'Trend Analysis',
        filters: [],
        segments: [],
        visualizationType: 'pie'
      }
    ])
  }
  
  // Save the current dashboard
  const saveDashboard = () => {
    const name = prompt('Enter a name for this dashboard:')
    if (name) {
      setSavedDashboards([
        ...savedDashboards,
        {
          id: `dashboard-${Date.now()}`,
          name,
          items: [...dashboardItems]
        }
      ])
      alert(`Dashboard "${name}" saved successfully!`)
    }
  }
  
  // Load a saved dashboard
  const loadDashboard = (dashboard: any) => {
    setDashboardItems([...dashboard.items])
    setActiveTab('build')
  }
  
  // Remove an item from the dashboard
  const removeItem = (index: number) => {
    const newItems = [...dashboardItems]
    newItems.splice(index, 1)
    setDashboardItems(newItems)
  }
  
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Custom Dashboard Builder</CardTitle>
              <CardDescription>
                Create and customize your own segment visualizations
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveDashboard}>
                <Save className="h-4 w-4 mr-2" />
                Save Dashboard
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Layout className="h-4 w-4 mr-2" />
                    Templates
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    setDashboardItems([
                      {
                        id: `item-${Date.now()}`,
                        type: 'segment',
                        title: 'Customer Value Analysis',
                        filters: [{ id: 'f1', type: 'segment', value: 'Champions', operator: 'is' }],
                        segments: [],
                        visualizationType: 'pie'
                      },
                      {
                        id: `item-${Date.now() + 1}`,
                        type: 'segment',
                        title: 'At-Risk Customers',
                        filters: [{ id: 'f2', type: 'segment', value: 'At Risk (High Value)', operator: 'is' }],
                        segments: [],
                        visualizationType: 'bar'
                      }
                    ])
                  }}>
                    Customer Value Analysis
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setDashboardItems([
                      {
                        id: `item-${Date.now()}`,
                        type: 'segment',
                        title: 'Product Preferences',
                        filters: [],
                        segments: [],
                        visualizationType: 'pie'
                      },
                      {
                        id: `item-${Date.now() + 1}`,
                        type: 'combined',
                        title: 'Loyal Customers + Denim Preference',
                        filters: [],
                        segments: [
                          { id: 's1', type: 'segment', value: 'Loyal Customers' },
                          { id: 's2', type: 'product', value: 'Denim' }
                        ],
                        visualizationType: 'pie'
                      }
                    ])
                  }}>
                    Product Preference Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    setDashboardItems([
                      {
                        id: `item-${Date.now()}`,
                        type: 'segment',
                        title: 'Gender Distribution',
                        filters: [{ id: 'f1', type: 'gender', value: 'Male', operator: 'is' }],
                        segments: [],
                        visualizationType: 'pie'
                      },
                      {
                        id: `item-${Date.now() + 1}`,
                        type: 'segment',
                        title: 'Age Distribution',
                        filters: [{ id: 'f2', type: 'age', min: 20, max: 30, operator: 'between' }],
                        segments: [],
                        visualizationType: 'bar'
                      }
                    ])
                  }}>
                    Demographic Insights
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="build">
                <Settings className="h-4 w-4 mr-2" />
                Build
              </TabsTrigger>
              <TabsTrigger value="view">
                <Eye className="h-4 w-4 mr-2" />
                View
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="build">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Add Visualizations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => addVisualization('segment')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Segment Visualization
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => addVisualization('combined')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Combined Segments
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => addVisualization('trend')}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Trend Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Saved Dashboards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {savedDashboards.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No saved dashboards yet</p>
                      ) : (
                        <div className="space-y-2">
                          {savedDashboards.map(dashboard => (
                            <Button 
                              key={dashboard.id}
                              variant="ghost" 
                              className="w-full justify-start"
                              onClick={() => loadDashboard(dashboard)}
                            >
                              {dashboard.name}
                            </Button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    {dashboardItems.length === 0 ? (
                      <div className="border border-dashed rounded-lg p-8 text-center">
                        <p className="text-muted-foreground">
                          Add visualizations from the left panel to start building your dashboard
                        </p>
                      </div>
                    ) : (
                      dashboardItems.map((item, index) => (
                        <Card key={item.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-lg">{item.title}</CardTitle>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeItem(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <DashboardItem 
                              item={item} 
                              setDashboardItems={setDashboardItems} 
                              index={index} 
                            />
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="view">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      {/* This would render the actual visualization based on the item configuration */}
                      <div className="flex items-center justify-center h-full border rounded-md">
                        <p className="text-muted-foreground">Visualization preview</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {dashboardItems.length === 0 && (
                  <div className="col-span-3 border border-dashed rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">
                      No visualizations added yet. Go to the "Build" tab to create your dashboard.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
