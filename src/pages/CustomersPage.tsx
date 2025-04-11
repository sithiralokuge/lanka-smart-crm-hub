
import { useState } from "react";
import { 
  Search, 
  Filter, 
  UserPlus, 
  FileUp, 
  MoreHorizontal, 
  Download,
  Edit,
  Trash,
  Eye
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { customerData } from "@/data/mockData";
import { Customer } from "@/types";

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("all");
  
  // Filter customers based on search and segment
  const filteredCustomers = customerData.filter((customer) => {
    const matchesSearch = 
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSegment = segmentFilter === "all" || customer.segment === segmentFilter;
    
    return matchesSearch && matchesSegment;
  });
  
  const getSegmentBadge = (segment?: string) => {
    switch(segment) {
      case "high_value":
        return <Badge className="bg-purple-600">High Value</Badge>;
      case "medium_value":
        return <Badge className="bg-purple-400">Medium Value</Badge>;
      case "low_value":
        return <Badge className="bg-purple-200 text-purple-800">Low Value</Badge>;
      case "at_risk":
        return <Badge variant="destructive">At Risk</Badge>;
      default:
        return <Badge variant="outline">Unclassified</Badge>;
    }
  };
  
  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">Manage and analyze your customer database.</p>
      </div>
      
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="high_value">High Value</SelectItem>
              <SelectItem value="medium_value">Medium Value</SelectItem>
              <SelectItem value="low_value">Low Value</SelectItem>
              <SelectItem value="at_risk">At Risk</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>More Filters</span>
          </Button>
          
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              <span>Import</span>
            </Button>
            
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              <span>Add Customer</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Customers Table */}
      <div className="rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead>Consent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{customer.email}</span>
                      <span className="text-xs text-muted-foreground">{customer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.city ?? "N/A"}
                  </TableCell>
                  <TableCell>
                    {getSegmentBadge(customer.segment)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    Rs. {customer.totalSpent.toLocaleString('en-LK')}
                  </TableCell>
                  <TableCell>
                    {customer.consentGiven ? 
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Consented
                      </Badge> : 
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        No Consent
                      </Badge>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                          <Download className="h-4 w-4" />
                          <span>Export</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-destructive cursor-pointer">
                          <Trash className="h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No customers found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
        <div>Showing {filteredCustomers.length} of {customerData.length} customers</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
