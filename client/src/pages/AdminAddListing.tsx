import { useState } from "react";
import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import ImageUploader from "@/components/ImageUploader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ListingFormData {
  category: string;
  subcategory: string;
  title: string;
  description: string;
  price: number | "";
  priceOnRequest: boolean;
  condition: string;
  locationAddress: string;
  locationArea: string;
  virtualTourUrl: string;
  videoUrl: string;
  featured: boolean;
  internalNotes: string;
  images: any[];
}

export default function AdminAddListing() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ListingFormData>({
    category: "real_estate",
    subcategory: "apartment",
    title: "",
    description: "",
    price: "",
    priceOnRequest: false,
    condition: "excellent",
    locationAddress: "",
    locationArea: "",
    virtualTourUrl: "",
    videoUrl: "",
    featured: false,
    internalNotes: "",
    images: [],
  });

  // tRPC mutation for creating listing
  const createListingMutation = trpc.listings.create.useMutation({
    onSuccess: () => {
      toast.success("Listing created successfully!");
      setLocation("/admin/inventory");
    },
    onError: (error) => {
      setError(error.message || "Failed to create listing");
      toast.error(error.message || "Failed to create listing");
    },
  });

  const steps = [
    { number: 1, label: "Category & Type" },
    { number: 2, label: "Basic Info" },
    { number: 3, label: "Images" },
    { number: 4, label: "Location" },
    { number: 5, label: "Review & Publish" },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagesChange = (images: any[]) => {
    setFormData((prev) => ({
      ...prev,
      images,
    }));
  };

  const formatPrice = (price: number | "") => {
    if (price === "") return "";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return formData.category && formData.subcategory;
      case 2:
        return formData.title && formData.description && (formData.price || formData.priceOnRequest);
      case 3:
        return formData.images.length > 0;
      case 4:
        return formData.locationAddress && formData.locationArea;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate form data
      if (!formData.title || !formData.description || !formData.locationAddress) {
        setError("Please fill in all required fields");
        return;
      }

      if (formData.images.length === 0) {
        setError("Please upload at least one image");
        return;
      }

      // Call tRPC mutation
      await createListingMutation.mutateAsync({
        category: formData.category as any,
        subcategory: formData.subcategory,
        title: formData.title,
        description: formData.description,
        price: formData.price ? parseInt(formData.price.toString()) : undefined,
        priceOnRequest: formData.priceOnRequest,
        condition: formData.condition,
        specifications: {},
        locationAddress: formData.locationAddress,
        locationArea: formData.locationArea,
        virtualTourUrl: formData.virtualTourUrl,
        videoUrl: formData.videoUrl,
        featured: formData.featured,
        internalNotes: formData.internalNotes,
        images: formData.images.map((img) => img.preview),
      });
    } catch (err) {
      console.error("Error creating listing:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Add New Listing</h1>
          <p className="text-muted-foreground">
            Create a new property or vehicle listing in 5 easy steps
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <button
                  onClick={() => setCurrentStep(step.number)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                    currentStep >= step.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </button>
                <div className="ml-3">
                  <p className="text-sm font-medium">{step.label}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 rounded transition-all ${
                      currentStep > step.number ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Form Content */}
        <Card className="p-8">
          {/* Step 1: Category & Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "real_estate", label: "Real Estate" },
                    { value: "vehicle", label: "Vehicle" },
                    { value: "land", label: "Land" },
                    { value: "commercial", label: "Commercial" },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleInputChange("category", cat.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.category === cat.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium">{cat.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Subcategory</label>
                <Select value={formData.subcategory} onValueChange={(value) => handleInputChange("subcategory", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.category === "real_estate" && (
                      <>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                      </>
                    )}
                    {formData.category === "vehicle" && (
                      <>
                        <SelectItem value="sedan">Sedan</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="truck">Truck</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                      </>
                    )}
                    {formData.category === "land" && (
                      <>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                      </>
                    )}
                    {formData.category === "commercial" && (
                      <>
                        <SelectItem value="office">Office Space</SelectItem>
                        <SelectItem value="retail">Retail Space</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Basic Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="e.g., Luxury Villa in Lekki Phase 1"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Detailed description of the property or vehicle..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Price (NGN)</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value ? parseInt(e.target.value) : "")}
                    disabled={formData.priceOnRequest}
                  />
                  {formData.price && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatPrice(formData.price as number)}
                    </p>
                  )}
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.priceOnRequest}
                      onChange={(e) => handleInputChange("priceOnRequest", e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Price on Request</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">Condition</label>
                <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="needs-repair">Needs Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-4">Upload Images</h3>
                <ImageUploader onImagesChange={handleImagesChange} />
              </div>
            </div>
          )}

          {/* Step 4: Location */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Address</label>
                <Input
                  placeholder="e.g., 123 Main Street, Lagos"
                  value={formData.locationAddress}
                  onChange={(e) => handleInputChange("locationAddress", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Area / Neighborhood</label>
                <Input
                  placeholder="e.g., Lekki Phase 1"
                  value={formData.locationArea}
                  onChange={(e) => handleInputChange("locationArea", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Virtual Tour URL (Optional)</label>
                <Input
                  type="url"
                  placeholder="https://example.com/tour"
                  value={formData.virtualTourUrl}
                  onChange={(e) => handleInputChange("virtualTourUrl", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Video URL (Optional)</label>
                <Input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 5: Review & Publish */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold">Review Your Listing</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">{formData.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subcategory</p>
                  <p className="font-medium capitalize">{formData.subcategory}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{formData.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">
                    {formData.priceOnRequest ? "On Request" : formatPrice(formData.price as number)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{formData.locationArea}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Images</p>
                  <p className="font-medium">{formData.images.length} uploaded</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm">
                  <strong>Ready to publish?</strong> Click "Publish Listing" below to make this listing live on the marketplace.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange("featured", e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Feature this listing (premium visibility)</span>
                </label>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {currentStep < 5 && (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceedToNextStep()}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}

            {currentStep === 5 && (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || createListingMutation.isPending}
                className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                <Check className="h-4 w-4 mr-2" />
                {isSubmitting || createListingMutation.isPending ? "Publishing..." : "Publish Listing"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
