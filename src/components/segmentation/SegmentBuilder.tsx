import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Save, Filter, ArrowRight, Check } from 'lucide-react'
import { InfoCircledIcon, ReloadIcon } from '@radix-ui/react-icons'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  getCustomSegments,
  createCustomSegment,
  updateCustomSegment,
  deleteCustomSegment,
  previewCustomSegment,
  getSegmentOptions,
  Segment as SegmentType,
  SegmentRule
} from '@/services/segmentationApi'

export function SegmentBuilder() {
  const [segments, setSegments] = useState<SegmentType[]>([])
  const [currentSegment, setCurrentSegment] = useState<Partial<SegmentType>>({
    name: '',
    description: '',
    rules: [],
    isActive: true
  })
  const [activeTab, setActiveTab] = useState('create')
  const [loading, setLoading] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewData, setPreviewData] = useState<{ count: number; percentage: number } | null>(null)

  // State for dynamic field options
  const [rfmSegmentOptions, setRfmSegmentOptions] = useState<string[]>([])
  const [categoryOptions, setCategoryOptions] = useState<string[]>([])
  const [materialOptions, setMaterialOptions] = useState<string[]>([])
  const [preferenceSegmentOptions, setPreferenceSegmentOptions] = useState<string[]>([])
  const [locationOptions, setLocationOptions] = useState<string[]>([])

  // Load segments and options on component mount
  useEffect(() => {
    loadSegments()
    loadSegmentOptions()
  }, [])

  // Load segments from API
  const loadSegments = async () => {
    setLoading(true)
    try {
      const data = await getCustomSegments()
      setSegments(data)
    } catch (error) {
      console.error('Error loading segments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load segment options from API
  const loadSegmentOptions = async () => {
    try {
      const options = await getSegmentOptions()
      console.log('Loaded segment options:', options)

      // Set options in state
      setRfmSegmentOptions(options.rfm_segments || [])
      setCategoryOptions(options.categories || [])
      setMaterialOptions(options.materials || [])
      setPreferenceSegmentOptions(options.preference_segments || [])
      setLocationOptions(options.locations || [])
    } catch (error) {
      console.error('Error loading segment options:', error)
    }
  }

  // Add a new rule to the current segment
  const addRule = () => {
    setCurrentSegment({
      ...currentSegment,
      rules: [
        ...currentSegment.rules,
        {
          id: `rule-${Date.now()}`,
          type: 'purchase',
          operator: 'greater_than',
          value: '',
          valueType: 'number'
        }
      ]
    })
  }

  // Remove a rule from the current segment
  const removeRule = (ruleId: string) => {
    setCurrentSegment({
      ...currentSegment,
      rules: currentSegment.rules.filter((rule: any) => rule.id !== ruleId)
    })
  }

  // Update a rule in the current segment
  const updateRule = (ruleId: string, field: string, value: any) => {
    setCurrentSegment({
      ...currentSegment,
      rules: currentSegment.rules.map((rule: any) =>
        rule.id === ruleId ? { ...rule, [field]: value } : rule
      )
    })
  }

  // Preview the current segment
  const previewSegment = async () => {
    if (currentSegment.rules && currentSegment.rules.length > 0) {
      setPreviewLoading(true)
      try {
        const data = await previewCustomSegment(currentSegment as any)
        setPreviewData(data)
        console.log('Preview data:', data) // Log the preview data
      } catch (error) {
        console.error('Error previewing segment:', error)
      } finally {
        setPreviewLoading(false)
      }
    }
  }

  // Automatically preview segment when rules change
  useEffect(() => {
    if (currentSegment.rules && currentSegment.rules.length > 0) {
      previewSegment()
    }
  }, [currentSegment.rules])

  // Save the current segment
  const saveSegment = async () => {
    if (!currentSegment.name) {
      alert('Please provide a name for the segment')
      return
    }

    if (!currentSegment.rules || currentSegment.rules.length === 0) {
      alert('Please add at least one rule to the segment')
      return
    }

    setLoading(true)

    try {
      // Check if we're editing an existing segment or creating a new one
      if (currentSegment.id) {
        // Update existing segment
        const updatedSegment = await updateCustomSegment(
          currentSegment.id,
          currentSegment as Omit<SegmentType, 'id' | 'createdAt' | 'updatedAt'>
        )

        if (updatedSegment) {
          setSegments(segments.map(s => s.id === updatedSegment.id ? updatedSegment : s))
        }
      } else {
        // Create new segment
        const newSegment = await createCustomSegment(
          currentSegment as Omit<SegmentType, 'id' | 'createdAt' | 'updatedAt' | 'customerCount' | 'customerPercentage'>
        )

        if (newSegment) {
          setSegments([...segments, newSegment])
        }
      }

      // Reset current segment
      setCurrentSegment({
        name: '',
        description: '',
        rules: [],
        isActive: true
      })

      // Reset preview data
      setPreviewData(null)

      // Switch to manage tab
      setActiveTab('manage')
    } catch (error) {
      console.error('Error saving segment:', error)
      alert('Failed to save segment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Edit an existing segment
  const editSegment = (segment: SegmentType) => {
    setCurrentSegment({ ...segment })
    setPreviewData({
      count: segment.customerCount || 0,
      percentage: segment.customerPercentage || 0
    })
    setActiveTab('create')
  }

  // Delete a segment
  const deleteSegment = async (segmentId: string) => {
    if (confirm('Are you sure you want to delete this segment?')) {
      setLoading(true)
      try {
        const success = await deleteCustomSegment(segmentId)
        if (success) {
          setSegments(segments.filter(s => s.id !== segmentId))
        } else {
          alert('Failed to delete segment. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting segment:', error)
        alert('Failed to delete segment. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  // Toggle segment active status
  const toggleSegmentActive = async (segmentId: string) => {
    const segment = segments.find(s => s.id === segmentId)
    if (!segment) return

    setLoading(true)
    try {
      const updatedSegment = await updateCustomSegment(segmentId, {
        ...segment,
        isActive: !segment.isActive
      })

      if (updatedSegment) {
        setSegments(segments.map(s => s.id === segmentId ? updatedSegment : s))
      } else {
        alert('Failed to update segment status. Please try again.')
      }
    } catch (error) {
      console.error('Error updating segment status:', error)
      alert('Failed to update segment status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Get the appropriate value input based on rule type
  const getRuleValueInput = (rule: any) => {
    switch (rule.type) {
      case 'purchase':
      case 'visit':
        return (
          <Input
            type="number"
            value={rule.value}
            onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
            className="w-[100px]"
          />
        )

      case 'product_category':
        return (
          <Select
            value={rule.value}
            onValueChange={(value) => updateRule(rule.id, 'value', value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.length > 0 ? (
                categoryOptions.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Footwear">Footwear</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        )

      case 'age':
        if (rule.operator === 'between') {
          return (
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs">{rule.minValue || 18}</span>
                <span className="text-xs">{rule.maxValue || 65}</span>
              </div>
              <Slider
                defaultValue={[rule.minValue || 18, rule.maxValue || 65]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => {
                  updateRule(rule.id, 'minValue', value[0])
                  updateRule(rule.id, 'maxValue', value[1])
                }}
              />
            </div>
          )
        } else {
          return (
            <Input
              type="number"
              value={rule.value}
              onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
              className="w-[100px]"
            />
          )
        }

      case 'gender':
        return (
          <Select
            value={rule.value}
            onValueChange={(value) => updateRule(rule.id, 'value', value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        )

      case 'location':
        return (
          <Input
            type="text"
            value={rule.value}
            onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
            className="w-[200px]"
            placeholder="City, State, or Country"
          />
        )

      case 'material':
        return (
          <Select
            value={rule.value}
            onValueChange={(value) => updateRule(rule.id, 'value', value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              {materialOptions.length > 0 ? (
                materialOptions.map(material => (
                  <SelectItem key={material} value={material}>{material}</SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="Cotton">Cotton</SelectItem>
                  <SelectItem value="Leather">Leather</SelectItem>
                  <SelectItem value="Synthetic">Synthetic</SelectItem>
                  <SelectItem value="Wool">Wool</SelectItem>
                  <SelectItem value="Denim">Denim</SelectItem>
                  <SelectItem value="Polyester">Polyester</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        )

      case 'preference_segment':
        return (
          <Select
            value={rule.value}
            onValueChange={(value) => updateRule(rule.id, 'value', value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select preference segment" />
            </SelectTrigger>
            <SelectContent>
              {preferenceSegmentOptions.length > 0 ? (
                preferenceSegmentOptions.map(segment => (
                  <SelectItem key={segment} value={segment}>{segment}</SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="Fashion Enthusiasts">Fashion Enthusiasts</SelectItem>
                  <SelectItem value="Casual Shoppers">Casual Shoppers</SelectItem>
                  <SelectItem value="Seasonal Buyers">Seasonal Buyers</SelectItem>
                  <SelectItem value="Brand Loyalists">Brand Loyalists</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        )

      case 'rfm_segment':
        return (
          <Select
            value={rule.value}
            onValueChange={(value) => updateRule(rule.id, 'value', value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select RFM segment" />
            </SelectTrigger>
            <SelectContent>
              {rfmSegmentOptions.length > 0 ? (
                rfmSegmentOptions.map(segment => (
                  <SelectItem key={segment} value={segment}>{segment}</SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="Champions">Champions</SelectItem>
                  <SelectItem value="Loyal Customers">Loyal Customers</SelectItem>
                  <SelectItem value="Potential Loyalists">Potential Loyalists</SelectItem>
                  <SelectItem value="New Customers">New Customers</SelectItem>
                  <SelectItem value="At Risk">At Risk</SelectItem>
                  <SelectItem value="Lost Customers">Lost Customers</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        )

      default:
        return (
          <Input
            type="text"
            value={rule.value}
            onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
            className="w-[150px]"
          />
        )
    }
  }

  // Get the appropriate operators based on rule type
  const getRuleOperators = (ruleType: string) => {
    switch (ruleType) {
      case 'purchase':
      case 'visit':
        return [
          { value: 'greater_than', label: 'Greater than' },
          { value: 'less_than', label: 'Less than' },
          { value: 'equal_to', label: 'Equal to' }
        ]

      case 'product_category':
      case 'gender':
        return [
          { value: 'is', label: 'Is' },
          { value: 'is_not', label: 'Is not' }
        ]

      case 'age':
        return [
          { value: 'greater_than', label: 'Greater than' },
          { value: 'less_than', label: 'Less than' },
          { value: 'equal_to', label: 'Equal to' },
          { value: 'between', label: 'Between' }
        ]

      case 'location':
        return [
          { value: 'is', label: 'Is' },
          { value: 'contains', label: 'Contains' }
        ]

      case 'material':
        return [
          { value: 'is', label: 'Is' },
          { value: 'is_not', label: 'Is not' }
        ]

      case 'preference_segment':
        return [
          { value: 'is', label: 'Is' },
          { value: 'is_not', label: 'Is not' }
        ]

      case 'rfm_segment':
        return [
          { value: 'is', label: 'Is' },
          { value: 'is_not', label: 'Is not' }
        ]

      default:
        return [
          { value: 'is', label: 'Is' },
          { value: 'is_not', label: 'Is not' },
          { value: 'contains', label: 'Contains' }
        ]
    }
  }

  // Get human-readable rule description
  const getRuleDescription = (rule: any) => {
    let typeLabel = ''
    let operatorLabel = ''
    let valueLabel = rule.value

    // Type labels
    switch (rule.type) {
      case 'purchase': typeLabel = 'Purchase count'; break
      case 'visit': typeLabel = 'Visit count'; break
      case 'product_category': typeLabel = 'Product category'; break
      case 'age': typeLabel = 'Age'; break
      case 'gender': typeLabel = 'Gender'; break
      case 'location': typeLabel = 'Location'; break
      case 'material': typeLabel = 'Product Material'; break
      case 'preference_segment': typeLabel = 'Preference Segment'; break
      case 'rfm_segment': typeLabel = 'RFM Segment'; break
      default: typeLabel = rule.type
    }

    // Operator labels
    switch (rule.operator) {
      case 'greater_than': operatorLabel = 'is greater than'; break
      case 'less_than': operatorLabel = 'is less than'; break
      case 'equal_to': operatorLabel = 'is equal to'; break
      case 'is': operatorLabel = 'is'; break
      case 'is_not': operatorLabel = 'is not'; break
      case 'contains': operatorLabel = 'contains'; break
      case 'between': operatorLabel = 'is between'; break
      default: operatorLabel = rule.operator
    }

    // Special case for between operator
    if (rule.operator === 'between' && rule.type === 'age') {
      return `${typeLabel} ${operatorLabel} ${rule.minValue || 18} and ${rule.maxValue || 65}`
    }

    // Special case for product category
    if (rule.type === 'product_category') {
      // Already using capitalized values, no need to transform
      valueLabel = rule.value;
    }

    // Special case for gender
    if (rule.type === 'gender') {
      switch (rule.value) {
        case 'male': valueLabel = 'Male'; break
        case 'female': valueLabel = 'Female'; break
        case 'other': valueLabel = 'Other'; break
      }
    }

    return `${typeLabel} ${operatorLabel} ${valueLabel}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Segment Builder</CardTitle>
          <CardDescription>
            Create custom segments based on customer attributes and behaviors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="create">Create Segment</TabsTrigger>
              <TabsTrigger value="manage">Manage Segments</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="segment-name">Segment Name</Label>
                    <Input
                      id="segment-name"
                      value={currentSegment.name}
                      onChange={(e) => setCurrentSegment({ ...currentSegment, name: e.target.value })}
                      placeholder="e.g., High-Value Denim Lovers"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="segment-active" className="block mb-2">Status</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="segment-active"
                        checked={currentSegment.isActive}
                        onCheckedChange={(checked) => setCurrentSegment({ ...currentSegment, isActive: checked })}
                      />
                      <Label htmlFor="segment-active">
                        {currentSegment.isActive ? 'Active' : 'Inactive'}
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="segment-description">Description</Label>
                  <Input
                    id="segment-description"
                    value={currentSegment.description}
                    onChange={(e) => setCurrentSegment({ ...currentSegment, description: e.target.value })}
                    placeholder="Describe the purpose of this segment"
                    className="mt-1"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Segment Rules</Label>
                    <Button variant="outline" size="sm" onClick={addRule}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Rule
                    </Button>
                  </div>

                  {currentSegment.rules.length === 0 ? (
                    <div className="border border-dashed rounded-md p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        No rules defined yet. Add rules to define this segment.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentSegment.rules.map((rule: any, index: number) => (
                        <div key={rule.id} className="flex items-center gap-2 bg-muted p-3 rounded-md">
                          {index > 0 && (
                            <Badge variant="outline" className="mr-1">AND</Badge>
                          )}

                          <Select
                            value={rule.type}
                            onValueChange={(value) => updateRule(rule.id, 'type', value)}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Rule type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="purchase">Purchase Count</SelectItem>
                              <SelectItem value="visit">Visit Count</SelectItem>
                              <SelectItem value="product_category">Product Category</SelectItem>
                              <SelectItem value="material">Product Material</SelectItem>
                              <SelectItem value="preference_segment">Preference Segment</SelectItem>
                              <SelectItem value="age">Age</SelectItem>
                              <SelectItem value="gender">Gender</SelectItem>
                              <SelectItem value="location">Location</SelectItem>
                              <SelectItem value="rfm_segment">RFM Segment</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={rule.operator}
                            onValueChange={(value) => updateRule(rule.id, 'operator', value)}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              {getRuleOperators(rule.type).map(op => (
                                <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {getRuleValueInput(rule)}

                          <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {currentSegment.rules.length > 0 && (
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Segment Preview</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      This segment will include customers who match ALL of the following criteria:
                    </p>
                    <div className="space-y-1">
                      {currentSegment.rules.map((rule: any) => (
                        <div key={rule.id} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{getRuleDescription(rule)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentSegment.rules && currentSegment.rules.length > 0 && (
                  <div className="bg-muted p-4 rounded-md mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Segment Size Estimate</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={previewSegment}
                        disabled={previewLoading}
                      >
                        {previewLoading ? (
                          <ReloadIcon className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <ReloadIcon className="h-4 w-4 mr-2" />
                        )}
                        Refresh Estimate
                      </Button>
                    </div>

                    {previewData ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Estimated customers in segment:</span>
                          <span className="font-medium">{previewData.count.toLocaleString()}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0%</span>
                            <span>100%</span>
                          </div>
                          <Progress value={previewData.percentage} className="h-2" />
                          <div className="text-right text-xs text-muted-foreground">
                            {previewData.percentage}% of total customers
                          </div>
                        </div>
                      </div>
                    ) : previewLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <ReloadIcon className="h-5 w-5 animate-spin mr-2" />
                        <span>Calculating segment size...</span>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-2">
                        Click "Refresh Estimate" to see how many customers match these rules
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={saveSegment}
                    disabled={loading || !currentSegment.name || !(currentSegment.rules && currentSegment.rules.length > 0)}
                  >
                    {loading ? (
                      <ReloadIcon className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Segment
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="manage">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <ReloadIcon className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading segments...</span>
                </div>
              ) : segments.length === 0 ? (
                <div className="border border-dashed rounded-md p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No custom segments created yet
                  </p>
                  <Button onClick={() => setActiveTab('create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Segment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {segments.map(segment => (
                    <Card key={segment.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle>{segment.name}</CardTitle>
                              <Badge variant={segment.isActive ? 'default' : 'secondary'}>
                                {segment.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            {segment.description && (
                              <CardDescription className="mt-1">
                                {segment.description}
                              </CardDescription>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => editSegment(segment)}>
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => toggleSegmentActive(segment.id)}>
                              {segment.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => deleteSegment(segment.id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-muted p-3 rounded-md">
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Segment Size</h4>
                            <p className="text-lg font-medium">{segment.customerCount?.toLocaleString() || 'N/A'} customers</p>
                            <div className="w-full bg-background rounded-full h-2 mt-2">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${segment.customerPercentage || 0}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {segment.customerPercentage || 0}% of total customers
                            </p>
                          </div>

                          <div className="bg-muted p-3 rounded-md">
                            <h4 className="text-xs font-medium text-muted-foreground mb-1">Last Updated</h4>
                            <p className="text-sm">
                              {segment.updatedAt ? new Date(segment.updatedAt).toLocaleDateString() : 'N/A'}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button variant="secondary" size="sm" className="w-full">
                                <Filter className="h-3 w-3 mr-1" />
                                View Customers
                              </Button>
                            </div>
                          </div>
                        </div>

                        <h3 className="text-sm font-medium mb-2">Rules</h3>
                        <div className="space-y-1">
                          {segment.rules.map((rule: any, index: number) => (
                            <div key={rule.id} className="flex items-center gap-2">
                              {index > 0 && (
                                <Badge variant="outline" className="mr-1">AND</Badge>
                              )}
                              <span className="text-sm">{getRuleDescription(rule)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Segment
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Alert>
        <InfoCircledIcon className="h-4 w-4" />
        <AlertTitle>Segment Usage</AlertTitle>
        <AlertDescription>
          Custom segments can be used for targeted marketing campaigns and custom dashboards.
          Create segments based on customer behaviors, demographics, or preferences.
        </AlertDescription>
      </Alert>
    </div>
  )
}
