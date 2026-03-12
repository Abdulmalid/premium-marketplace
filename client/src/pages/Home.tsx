import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Home as HomeIcon, Car, TrendingUp, Users, Award } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"property" | "vehicle">("property");

  // Mock featured listings
  const featuredListings = [
    {
      id: "1",
      title: "Luxury Villa in Lekki Phase 1",
      category: "real_estate",
      price: 250000000,
      image: "https://via.placeholder.com/400x300?text=Luxury+Villa",
      status: "available",
      badge: "Just Listed",
    },
    {
      id: "2",
      title: "Mercedes-Benz GLE 2023",
      category: "vehicle",
      price: 45000000,
      image: "https://via.placeholder.com/400x300?text=Mercedes+GLE",
      status: "available",
      badge: "Price Reduced",
    },
    {
      id: "3",
      title: "Commercial Space in Victoria Island",
      category: "real_estate",
      price: 180000000,
      image: "https://via.placeholder.com/400x300?text=Commercial+Space",
      status: "available",
      badge: "Featured",
    },
    {
      id: "4",
      title: "Toyota Camry 2022 - Excellent Condition",
      category: "vehicle",
      price: 12500000,
      image: "https://via.placeholder.com/400x300?text=Toyota+Camry",
      status: "available",
      badge: "Available",
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const stats = [
    { label: "Active Properties", value: "2,847", icon: HomeIcon },
    { label: "Vehicles Listed", value: "1,523", icon: Car },
    { label: "Happy Clients", value: "15,000+", icon: Users },
  ];

  const features = [
    {
      icon: Award,
      title: "Verified Listings",
      description: "All properties and vehicles are thoroughly verified and authenticated",
    },
    {
      icon: TrendingUp,
      title: "Best Prices",
      description: "Competitive pricing with transparent market data and fair valuations",
    },
    {
      icon: MapPin,
      title: "Prime Locations",
      description: "Access to premium properties in the most sought-after areas",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">Premium Marketplace</div>
          <div className="flex gap-4">
            <a href="/listings" className="text-primary-foreground hover:text-primary-foreground/80">
              Browse Listings
            </a>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              List Your Property
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Find Your Dream Property or Vehicle
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Explore thousands of premium listings in Nigeria's most desirable locations
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto bg-card text-foreground rounded-lg p-6 shadow-xl">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab("property")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "property"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <HomeIcon className="inline mr-2 h-4 w-4" />
                Real Estate
              </button>
              <button
                onClick={() => setActiveTab("vehicle")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "vehicle"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Car className="inline mr-2 h-4 w-4" />
                Vehicles
              </button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder={
                  activeTab === "property"
                    ? "Search properties by location or type..."
                    : "Search vehicles by make or model..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="h-12 w-12 text-secondary mx-auto mb-4 flex items-center justify-center">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Featured Listings</h2>
          <p className="text-muted-foreground mb-12">
            Handpicked premium properties and vehicles
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <a key={listing.id} href={`/listings/${listing.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer card-hover">
                  <div className="relative">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground">
                      {listing.badge}
                    </Badge>
                    {listing.status === "available" && (
                      <Badge className="absolute top-3 left-3 status-available">
                        Available
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
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

          <div className="text-center mt-12">
            <a href="/listings">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Browse All Listings
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4 text-center">Why Choose Us</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            We provide the most reliable and transparent marketplace for real estate and vehicles
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-8 text-center">
                  <Icon className="h-12 w-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-primary-foreground/90 mb-8">
            List your property or vehicle today and reach thousands of buyers
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              List Your Property
            </Button>
            <Button variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
              Sell Your Vehicle
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">About Us</h4>
              <p className="text-primary-foreground/80 text-sm">
                Premium marketplace for real estate and vehicles in Nigeria
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Browse</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><a href="/listings" className="hover:text-primary-foreground">All Listings</a></li>
                <li><a href="/listings?category=real_estate" className="hover:text-primary-foreground">Properties</a></li>
                <li><a href="/listings?category=vehicle" className="hover:text-primary-foreground">Vehicles</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary-foreground">FAQ</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-sm text-primary-foreground/80">
                Email: info@marketplace.com<br />
                Phone: +234 (0) 123 456 7890
              </p>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/80">
            <p>&copy; 2024 Premium Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
