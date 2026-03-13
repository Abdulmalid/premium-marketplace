import { useState, useMemo } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  Star,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export default function AdminInventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Mock listings data
  const listings = [
    {
      id: "1",
      sku: "PROP-001",
      title: "Luxury Villa in Lekki Phase 1",
      category: "real_estate",
      status: "available",
      price: 250000000,
      views: 1247,
      inquiries: 23,
      featured: true,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      sku: "VHCL-001",
      title: "Mercedes-Benz GLE 2023",
      category: "vehicle",
      status: "available",
      price: 45000000,
      views: 856,
      inquiries: 12,
      featured: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      sku: "PROP-002",
      title: "Commercial Space in Victoria Island",
      category: "real_estate",
      status: "pending",
      price: 180000000,
      views: 432,
      inquiries: 8,
      featured: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "4",
      sku: "VHCL-002",
      title: "Toyota Camry 2022",
      category: "vehicle",
      status: "sold",
      price: 12500000,
      views: 2100,
      inquiries: 45,
      featured: false,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      id: "5",
      sku: "LAND-001",
      title: "Land Plot in Ikeja",
      category: "land",
      status: "available",
      price: 85000000,
      views: 654,
      inquiries: 15,
      featured: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  const filteredListings = useMemo(() => {
    let filtered = listings;

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((l) => l.category === categoryFilter);
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((l) => l.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "views":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [searchQuery, categoryFilter, statusFilter, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "status-available";
      case "sold":
        return "status-sold";
      case "pending":
        return "status-pending";
      default:
        return "status-coming-soon";
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      real_estate: "Real Estate",
      vehicle: "Vehicle",
      land: "Land",
      commercial: "Commercial",
    };
    return labels[category] || category;
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredListings.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredListings.map((l) => l.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            + Add New Listing
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by title or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="real_estate">Real Estate</SelectItem>
                <SelectItem value="vehicle">Vehicles</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <Card className="p-4 bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedItems.length} item(s) selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Mark as Sold
                </Button>
                <Button size="sm" variant="outline">
                  Toggle Featured
                </Button>
                <Button size="sm" variant="outline" className="text-red-600">
                  Delete Selected
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredListings.length && filteredListings.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">SKU / Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Views</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Inquiries</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(listing.id)}
                        onChange={() => toggleSelect(listing.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium">{listing.title}</div>
                        <div className="text-xs text-muted-foreground">{listing.sku}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {getCategoryLabel(listing.category)}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {formatPrice(listing.price)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">{listing.views}</td>
                    <td className="px-6 py-4 text-sm">{listing.inquiries}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-muted rounded transition-colors" title="View">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded transition-colors" title="Edit">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          className="p-2 hover:bg-muted rounded transition-colors"
                          title={listing.featured ? "Unfeature" : "Feature"}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              listing.featured
                                ? "fill-amber-500 text-amber-500"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded transition-colors" title="Delete">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredListings.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No listings found matching your criteria</p>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {filteredListings.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredListings.length} of {listings.length} listings
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
