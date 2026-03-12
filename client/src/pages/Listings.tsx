import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Grid3x3, List, MapPin, Filter } from "lucide-react";

export default function Listings() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [status, setStatus] = useState<string>("available");
  const [priceRange, setPriceRange] = useState([0, 500000000]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(true);

  // Mock listings data
  const allListings = [
    {
      id: "1",
      title: "Luxury Villa in Lekki Phase 1",
      category: "real_estate",
      subcategory: "villa",
      price: 250000000,
      image: "https://via.placeholder.com/300x200?text=Villa",
      status: "available",
      location: "Lekki Phase 1",
      beds: 5,
      baths: 4,
      sqm: 850,
    },
    {
      id: "2",
      title: "Mercedes-Benz GLE 2023",
      category: "vehicle",
      subcategory: "suv",
      price: 45000000,
      image: "https://via.placeholder.com/300x200?text=Mercedes",
      status: "available",
      location: "Lagos",
      year: 2023,
      mileage: 5000,
    },
    {
      id: "3",
      title: "Commercial Space in Victoria Island",
      category: "real_estate",
      subcategory: "commercial",
      price: 180000000,
      image: "https://via.placeholder.com/300x200?text=Commercial",
      status: "pending",
      location: "Victoria Island",
      sqm: 1200,
    },
    {
      id: "4",
      title: "Toyota Camry 2022",
      category: "vehicle",
      subcategory: "sedan",
      price: 12500000,
      image: "https://via.placeholder.com/300x200?text=Toyota",
      status: "available",
      location: "Lagos",
      year: 2022,
      mileage: 45000,
    },
    {
      id: "5",
      title: "Land Plot in Ikeja",
      category: "land",
      subcategory: "land",
      price: 85000000,
      image: "https://via.placeholder.com/300x200?text=Land",
      status: "available",
      location: "Ikeja",
      sqm: 500,
    },
    {
      id: "6",
      title: "Apartment in Ikoyi",
      category: "real_estate",
      subcategory: "apartment",
      price: 120000000,
      image: "https://via.placeholder.com/300x200?text=Apartment",
      status: "sold",
      location: "Ikoyi",
      beds: 3,
      baths: 2,
      sqm: 450,
    },
  ];

  const filteredListings = useMemo(() => {
    let filtered = allListings;

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((l) => l.category === category);
    }

    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter((l) => l.status === status);
    }

    // Filter by price range
    filtered = filtered.filter(
      (l) => l.price >= priceRange[0] && l.price <= priceRange[1]
    );

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        break;
    }

    return filtered;
  }, [searchQuery, category, status, priceRange, sortBy]);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Browse Listings</h1>
          <p className="text-primary-foreground/90">
            {filteredListings.length} listings found
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <Card className="p-6 sticky top-20">
                <h3 className="text-lg font-bold mb-4">Filters</h3>

                {/* Category */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={category} onValueChange={setCategory}>
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
                </div>

                {/* Status */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={status} onValueChange={setStatus}>
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
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">
                    Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  </label>
                  <Slider
                    min={0}
                    max={500000000}
                    step={10000000}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-full"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setCategory("all");
                    setStatus("available");
                    setPriceRange([0, 500000000]);
                    setSearchQuery("");
                  }}
                >
                  Reset Filters
                </Button>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by location or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Listings */}
            {filteredListings.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground text-lg">
                  No listings found matching your criteria
                </p>
              </Card>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <a key={listing.id} href={`/listings/${listing.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all card-hover">
                      <div className="relative">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-48 object-cover"
                        />
                        <Badge className={`absolute top-3 right-3 ${getStatusColor(listing.status)}`}>
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </Badge>
                        {listing.status === "sold" && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="sold-watermark-text">SOLD</div>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">
                          {listing.title}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm mb-3">
                          <MapPin className="h-4 w-4 mr-1" />
                          {listing.location}
                        </div>
                        <div className="price-display mb-3">
                          {formatPrice(listing.price)}
                        </div>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredListings.map((listing) => (
                  <a key={listing.id} href={`/listings/${listing.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all p-4 flex gap-4 cursor-pointer">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-48 h-32 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-lg">{listing.title}</h3>
                          <Badge className={getStatusColor(listing.status)}>
                            {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {listing.location}
                        </div>
                        <div className="price-display">
                          {formatPrice(listing.price)}
                        </div>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
