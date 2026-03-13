import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Save, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminSettings() {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [settings, setSettings] = useState({
    siteName: "Premium Marketplace",
    siteDescription: "Premium property and vehicle marketplace in Nigeria",
    contactEmail: "info@marketplace.com",
    contactPhone: "+234 (0) 123 456 7890",
    whatsappNumber: "+234 (0) 123 456 7890",
    address: "123 Main Street, Lagos, Nigeria",
    enableListingFees: true,
    listingFeeAmount: 5000,
    enableFeaturedListings: true,
    featuredListingFee: 25000,
    featuredListingDays: 30,
    enableNotifications: true,
    enableWhatsappIntegration: true,
    maintenanceMode: false,
    maintenanceMessage: "We are currently under maintenance. Please check back soon.",
  });

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    // Simulate API call
    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }, 1000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveStatus === "saving" ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Status Messages */}
        {saveStatus === "success" && (
          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            <CheckCircle className="h-5 w-5" />
            Settings saved successfully!
          </div>
        )}

        {saveStatus === "error" && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <AlertCircle className="h-5 w-5" />
            Error saving settings. Please try again.
          </div>
        )}

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6">Site Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Site Name</label>
                  <Input
                    value={settings.siteName}
                    onChange={(e) => handleInputChange("siteName", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Site Description</label>
                  <Textarea
                    value={settings.siteDescription}
                    onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Contact Email</label>
                    <Input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Contact Phone</label>
                    <Input
                      value={settings.contactPhone}
                      onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">WhatsApp Number</label>
                  <Input
                    value={settings.whatsappNumber}
                    onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Address</label>
                  <Input
                    value={settings.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6">Listing Fees</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Enable Listing Fees</p>
                    <p className="text-sm text-muted-foreground">Charge users to list properties or vehicles</p>
                  </div>
                  <Switch
                    checked={settings.enableListingFees}
                    onCheckedChange={(checked) => handleInputChange("enableListingFees", checked)}
                  />
                </div>

                {settings.enableListingFees && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Listing Fee Amount (NGN)</label>
                    <Input
                      type="number"
                      value={settings.listingFeeAmount}
                      onChange={(e) => handleInputChange("listingFeeAmount", parseInt(e.target.value))}
                    />
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6">Featured Listings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Enable Featured Listings</p>
                    <p className="text-sm text-muted-foreground">Allow users to promote listings</p>
                  </div>
                  <Switch
                    checked={settings.enableFeaturedListings}
                    onCheckedChange={(checked) => handleInputChange("enableFeaturedListings", checked)}
                  />
                </div>

                {settings.enableFeaturedListings && (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Featured Listing Fee (NGN)</label>
                      <Input
                        type="number"
                        value={settings.featuredListingFee}
                        onChange={(e) => handleInputChange("featuredListingFee", parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Featured Duration (Days)</label>
                      <Input
                        type="number"
                        value={settings.featuredListingDays}
                        onChange={(e) => handleInputChange("featuredListingDays", parseInt(e.target.value))}
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6">Third-party Integrations</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Enable Notifications</p>
                    <p className="text-sm text-muted-foreground">Send email and in-app notifications</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => handleInputChange("enableNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">WhatsApp Integration</p>
                    <p className="text-sm text-muted-foreground">Enable WhatsApp messaging for inquiries</p>
                  </div>
                  <Switch
                    checked={settings.enableWhatsappIntegration}
                    onCheckedChange={(checked) => handleInputChange("enableWhatsappIntegration", checked)}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">API Keys</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Stripe API Key</label>
                  <Input
                    type="password"
                    placeholder="sk_live_..."
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">Configured in environment variables</p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">WhatsApp Business API Token</label>
                  <Input
                    type="password"
                    placeholder="••••••••••••••••"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1">Configured in environment variables</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-6">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Disable site access for maintenance</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
                  />
                </div>

                {settings.maintenanceMode && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Maintenance Message</label>
                    <Textarea
                      value={settings.maintenanceMessage}
                      onChange={(e) => handleInputChange("maintenanceMessage", e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Database</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Total Listings</span>
                  <span className="font-medium">2,847</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Total Inquiries</span>
                  <span className="font-medium">12,543</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Database Size</span>
                  <span className="font-medium">245 MB</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
