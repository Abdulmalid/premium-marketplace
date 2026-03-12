import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, MessageCircle, Share2, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "wouter";

export default function ListingDetail() {
  const params = useParams();
  const listingId = params?.id;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [inquiryStep, setInquiryStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    message: "",
    viewingDate: "",
  });

  // Mock listing data
  const listing = {
    id: listingId,
    title: "Luxury Villa in Lekki Phase 1",
    category: "real_estate",
    subcategory: "villa",
    price: 250000000,
    priceOnRequest: false,
    status: "available",
    location: "Lekki Phase 1, Lagos",
    description:
      "Stunning 5-bedroom luxury villa with modern architecture and premium finishes. Features include a swimming pool, home theater, gym, and spacious gardens. Located in a gated community with 24/7 security.",
    images: [
      "https://via.placeholder.com/800x600?text=Villa+Front",
      "https://via.placeholder.com/800x600?text=Living+Room",
      "https://via.placeholder.com/800x600?text=Master+Bedroom",
      "https://via.placeholder.com/800x600?text=Kitchen",
      "https://via.placeholder.com/800x600?text=Pool",
    ],
    specifications: {
      beds: 5,
      baths: 4,
      sqm: 850,
      yearBuilt: 2021,
      furnished: "Fully Furnished",
      parking: 3,
      amenities: ["Swimming Pool", "Home Theater", "Gym", "Security", "Garden", "Balcony"],
    },
    agent: {
      name: "John Doe",
      phone: "+234 (0) 123 456 7890",
      whatsapp: "+234 (0) 123 456 7890",
      avatar: "https://via.placeholder.com/100x100?text=Agent",
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    views: 1247,
    inquiries: 23,
  };

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

  const handleInquirySubmit = () => {
    console.log("Inquiry submitted:", formData);
    alert("Thank you! Your inquiry has been submitted. We'll contact you soon.");
    setInquiryStep(1);
    setFormData({ name: "", email: "", phone: "", whatsapp: "", message: "", viewingDate: "" });
  };

  const handleWhatsAppClick = () => {
    const message = `Hi, I'm interested in: ${listing.title}. Price: ${formatPrice(listing.price)}`;
    const whatsappUrl = `https://wa.me/${listing.agent.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-4 sticky top-0 z-40">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="/listings" className="flex items-center gap-2 hover:opacity-80">
            <ChevronLeft className="h-5 w-5" />
            Back to Listings
          </a>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className="text-primary-foreground hover:bg-secondary/20"
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-secondary/20"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="overflow-hidden mb-8">
              <div className="relative bg-muted">
                <img
                  src={listing.images[currentImageIndex]}
                  alt={`${listing.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-96 object-cover"
                />
                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev - 1 + listing.images.length) % listing.images.length
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <Badge className={`absolute top-4 right-4 ${getStatusColor(listing.status)}`}>
                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </Badge>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 p-4 bg-card overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-secondary"
                        : "border-border hover:border-secondary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            </Card>

            {/* Title and Price */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">{listing.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-5 w-5" />
                {listing.location}
              </div>
              <div className="price-display text-4xl mb-4">
                {listing.priceOnRequest ? "Price on Request" : formatPrice(listing.price)}
              </div>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>{listing.views} views</span>
                <span>•</span>
                <span>{listing.inquiries} inquiries</span>
              </div>
            </div>

            {/* Specifications */}
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-muted-foreground text-sm">Bedrooms</div>
                  <div className="text-2xl font-bold">{listing.specifications.beds}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Bathrooms</div>
                  <div className="text-2xl font-bold">{listing.specifications.baths}</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Area</div>
                  <div className="text-2xl font-bold">{listing.specifications.sqm} sqm</div>
                </div>
                <div>
                  <div className="text-muted-foreground text-sm">Parking</div>
                  <div className="text-2xl font-bold">{listing.specifications.parking}</div>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {listing.description}
                </p>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Year Built:</strong> {listing.specifications.yearBuilt}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Furnished:</strong> {listing.specifications.furnished}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="features" className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {listing.specifications.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      {amenity}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="location" className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Location</h3>
                <p className="text-muted-foreground mb-4">{listing.location}</p>
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Map view would be displayed here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Agent Card */}
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Agent Information</h3>
              <img
                src={listing.agent.avatar}
                alt={listing.agent.name}
                className="w-16 h-16 rounded-full mb-4"
              />
              <h4 className="font-bold mb-2">{listing.agent.name}</h4>
              <p className="text-sm text-muted-foreground mb-4">Real Estate Agent</p>

              <div className="space-y-2 mb-4">
                <a href={`tel:${listing.agent.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Phone className="h-4 w-4" />
                  {listing.agent.phone}
                </a>
              </div>

              <Button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600 text-white hover:bg-green-700 mb-2"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>

              <Button variant="outline" className="w-full">
                Schedule Viewing
              </Button>
            </Card>

            {/* Inquiry Form */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Interested?</h3>

              {inquiryStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Full Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+234 (0) 123 456 7890"
                    />
                  </div>
                  <Button
                    onClick={() => setInquiryStep(2)}
                    className="w-full bg-primary text-primary-foreground"
                  >
                    Continue
                  </Button>
                </div>
              )}

              {inquiryStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Preferred Viewing Date</label>
                    <Input
                      type="date"
                      value={formData.viewingDate}
                      onChange={(e) => setFormData({ ...formData, viewingDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">WhatsApp Number (Optional)</label>
                    <Input
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="+234 (0) 123 456 7890"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your interest..."
                      rows={4}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setInquiryStep(1)}
                      variant="outline"
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleInquirySubmit}
                      className="flex-1 bg-primary text-primary-foreground"
                    >
                      Send Inquiry
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
