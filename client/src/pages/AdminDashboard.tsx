import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  TrendingUp,
  Package,
  MessageSquare,
  DollarSign,
  Eye,
  AlertCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats
  const statsQuery = trpc.admin.stats.useQuery();

  useEffect(() => {
    if (statsQuery.data) {
      setStats(statsQuery.data);
      setLoading(false);
    }
  }, [statsQuery.data]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    change,
    color,
  }: {
    icon: any;
    label: string;
    value: string | number;
    change?: number;
    color: string;
  }) => (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
              {change >= 0 ? "+" : ""}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );

  const recentActivities = [
    {
      id: 1,
      action: "New listing created",
      details: "Luxury Villa in Lekki Phase 1",
      timestamp: "2 hours ago",
      type: "listing",
    },
    {
      id: 2,
      action: "Inquiry received",
      details: "From John Doe on Mercedes-Benz GLE",
      timestamp: "1 hour ago",
      type: "inquiry",
    },
    {
      id: 3,
      action: "Listing marked as sold",
      details: "Commercial Space in Victoria Island",
      timestamp: "30 minutes ago",
      type: "status",
    },
    {
      id: 4,
      action: "New inquiry",
      details: "From Jane Smith on Apartment in Ikoyi",
      timestamp: "15 minutes ago",
      type: "inquiry",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Package}
            label="Total Listings"
            value={loading ? "..." : stats?.totalListings || 0}
            change={12}
            color="bg-blue-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Active Listings"
            value={loading ? "..." : stats?.activeListings || 0}
            change={8}
            color="bg-green-500"
          />
          <StatCard
            icon={MessageSquare}
            label="Total Inquiries"
            value={loading ? "..." : stats?.totalInquiries || 0}
            change={25}
            color="bg-purple-500"
          />
          <StatCard
            icon={DollarSign}
            label="Total Value"
            value={loading ? "..." : formatPrice(stats?.revenueValue || 0)}
            change={15}
            color="bg-amber-500"
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-blue-500" />
                  <span className="text-muted-foreground">Sold Listings</span>
                </div>
                <span className="font-bold text-lg">{stats?.soldListings || 0}</span>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span className="text-muted-foreground">New Inquiries</span>
                </div>
                <span className="font-bold text-lg">{stats?.newInquiries || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-muted-foreground">Conversion Rate</span>
                </div>
                <span className="font-bold text-lg">
                  {stats?.totalInquiries > 0
                    ? ((stats?.soldListings / stats?.totalInquiries) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 justify-start">
                + New Listing
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                View All Inquiries
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                Generate Report
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between pb-4 border-b border-border last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{activity.action}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                </div>
                <p className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                  {activity.timestamp}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
