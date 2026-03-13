import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Eye,
  Clock,
} from "lucide-react";

interface Activity {
  id: string;
  type: "create" | "update" | "delete" | "inquiry" | "status_change" | "view";
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  activities?: Activity[];
  isLive?: boolean;
  maxItems?: number;
}

export default function ActivityFeed({
  activities: initialActivities = [],
  isLive = true,
  maxItems = 10,
}: ActivityFeedProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [newActivityCount, setNewActivityCount] = useState(0);

  // Simulate real-time activity updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Randomly add new activities
      if (Math.random() > 0.7) {
        const mockActivities: Activity[] = [
          {
            id: `activity-${Date.now()}`,
            type: "inquiry",
            title: "New Inquiry Received",
            description: "John Doe inquired about Luxury Villa in Lekki Phase 1",
            timestamp: new Date(),
            user: "System",
          },
          {
            id: `activity-${Date.now()}`,
            type: "view",
            title: "Listing Viewed",
            description: "Mercedes-Benz GLE 2023 was viewed 5 times",
            timestamp: new Date(),
            user: "System",
          },
          {
            id: `activity-${Date.now()}`,
            type: "status_change",
            title: "Status Updated",
            description: "Commercial Space marked as Sold",
            timestamp: new Date(),
            user: "Admin",
          },
          {
            id: `activity-${Date.now()}`,
            type: "create",
            title: "New Listing Created",
            description: "Land Plot in Ikeja added to marketplace",
            timestamp: new Date(),
            user: "Editor",
          },
        ];

        const randomActivity = mockActivities[Math.floor(Math.random() * mockActivities.length)];
        setActivities((prev) => [randomActivity, ...prev.slice(0, maxItems - 1)]);
        setNewActivityCount((prev) => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLive, maxItems]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create":
        return <Plus className="h-5 w-5 text-green-500" />;
      case "update":
        return <Edit className="h-5 w-5 text-blue-500" />;
      case "delete":
        return <Trash2 className="h-5 w-5 text-red-500" />;
      case "inquiry":
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case "status_change":
        return <CheckCircle className="h-5 w-5 text-orange-500" />;
      case "view":
        return <Eye className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case "create":
        return "bg-green-100 text-green-800";
      case "update":
        return "bg-blue-100 text-blue-800";
      case "delete":
        return "bg-red-100 text-red-800";
      case "inquiry":
        return "bg-purple-100 text-purple-800";
      case "status_change":
        return "bg-orange-100 text-orange-800";
      case "view":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Header with notification badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Activity Feed</h3>
        {newActivityCount > 0 && (
          <Badge className="bg-blue-500 text-white">
            {newActivityCount} new
          </Badge>
        )}
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        {activities.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No activities yet</p>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card
              key={activity.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="mt-1 flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <Badge className={`text-xs ${getActivityBadgeColor(activity.type)}`}>
                      {activity.type.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {activity.user && (
                      <span>By <strong>{activity.user}</strong></span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* View All Button */}
      {activities.length > 0 && (
        <button className="w-full p-3 text-center text-sm font-medium text-primary hover:bg-muted rounded-lg transition-colors">
          View All Activities
        </button>
      )}
    </div>
  );
}
