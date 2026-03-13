import { useState, useMemo } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  User,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function AdminLeads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");

  // Mock inquiries data
  const inquiries = [
    {
      id: "1",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "+234 (0) 123 456 7890",
      customerWhatsapp: "+234 (0) 123 456 7890",
      listingTitle: "Luxury Villa in Lekki Phase 1",
      listingPrice: 250000000,
      status: "new",
      preferredViewingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      assignedTo: null,
      notes: [],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: "2",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      customerPhone: "+234 (0) 987 654 3210",
      customerWhatsapp: "+234 (0) 987 654 3210",
      listingTitle: "Mercedes-Benz GLE 2023",
      listingPrice: 45000000,
      status: "contacted",
      preferredViewingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      assignedTo: "Agent 1",
      notes: ["Customer interested in test drive", "Scheduled for Saturday"],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      customerName: "Michael Johnson",
      customerEmail: "michael@example.com",
      customerPhone: "+234 (0) 555 666 7777",
      customerWhatsapp: "+234 (0) 555 666 7777",
      listingTitle: "Commercial Space in Victoria Island",
      listingPrice: 180000000,
      status: "viewing_scheduled",
      preferredViewingDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      assignedTo: "Agent 2",
      notes: ["Viewing confirmed for tomorrow at 2 PM"],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "4",
      customerName: "Sarah Williams",
      customerEmail: "sarah@example.com",
      customerPhone: "+234 (0) 444 555 6666",
      customerWhatsapp: "+234 (0) 444 555 6666",
      listingTitle: "Land Plot in Ikeja",
      listingPrice: 85000000,
      status: "negotiating",
      preferredViewingDate: null,
      assignedTo: "Agent 1",
      notes: ["Negotiating price", "Customer willing to pay 80M"],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      id: "5",
      customerName: "David Brown",
      customerEmail: "david@example.com",
      customerPhone: "+234 (0) 333 444 5555",
      customerWhatsapp: "+234 (0) 333 444 5555",
      listingTitle: "Apartment in Ikoyi",
      listingPrice: 120000000,
      status: "closed_won",
      preferredViewingDate: null,
      assignedTo: "Agent 2",
      notes: ["Deal closed", "Payment received"],
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ];

  const filteredInquiries = useMemo(() => {
    let filtered = inquiries;

    if (searchQuery) {
      filtered = filtered.filter(
        (i) =>
          i.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.customerPhone.includes(searchQuery) ||
          i.listingTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((i) => i.status === statusFilter);
    }

    return filtered;
  }, [searchQuery, statusFilter]);

  const selectedInquiry = inquiries.find((i) => i.id === selectedLead);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-purple-100 text-purple-800";
      case "viewing_scheduled":
        return "bg-orange-100 text-orange-800";
      case "negotiating":
        return "bg-yellow-100 text-yellow-800";
      case "closed_won":
        return "bg-green-100 text-green-800";
      case "closed_lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      new: "New",
      contacted: "Contacted",
      viewing_scheduled: "Viewing Scheduled",
      negotiating: "Negotiating",
      closed_won: "Closed - Won",
      closed_lost: "Closed - Lost",
    };
    return labels[status] || status;
  };

  const handleAddNote = () => {
    if (noteInput.trim() && selectedInquiry) {
      // In a real app, this would update the database
      (selectedInquiry.notes as string[]).push(noteInput);
      setNoteInput("");
    }
  };

  const statusPipeline = [
    { status: "new", label: "New", count: inquiries.filter((i) => i.status === "new").length },
    { status: "contacted", label: "Contacted", count: inquiries.filter((i) => i.status === "contacted").length },
    { status: "viewing_scheduled", label: "Viewing Scheduled", count: inquiries.filter((i) => i.status === "viewing_scheduled").length },
    { status: "negotiating", label: "Negotiating", count: inquiries.filter((i) => i.status === "negotiating").length },
    { status: "closed_won", label: "Closed - Won", count: inquiries.filter((i) => i.status === "closed_won").length },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Leads Management</h1>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Pipeline Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {statusPipeline.map((stage) => (
            <Card key={stage.status} className="p-4 text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(stage.status)}>
              <div className="text-2xl font-bold text-primary mb-1">{stage.count}</div>
              <div className="text-sm text-muted-foreground">{stage.label}</div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="viewing_scheduled">Viewing Scheduled</SelectItem>
                    <SelectItem value="negotiating">Negotiating</SelectItem>
                    <SelectItem value="closed_won">Closed - Won</SelectItem>
                    <SelectItem value="closed_lost">Closed - Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    onClick={() => setSelectedLead(inquiry.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedLead === inquiry.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold">{inquiry.customerName}</h4>
                        <p className="text-sm text-muted-foreground">{inquiry.listingTitle}</p>
                      </div>
                      <Badge className={getStatusColor(inquiry.status)}>
                        {getStatusLabel(inquiry.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {inquiry.customerPhone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {inquiry.customerEmail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredInquiries.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No inquiries found</p>
                </div>
              )}
            </Card>
          </div>

          {/* Lead Details */}
          {selectedInquiry && (
            <Card className="p-6 lg:col-span-1">
              <h3 className="text-lg font-bold mb-4">Lead Details</h3>

              {/* Customer Info */}
              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Customer Name</p>
                  <p className="font-medium">{selectedInquiry.customerName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <a href={`mailto:${selectedInquiry.customerEmail}`} className="text-primary hover:underline">
                    {selectedInquiry.customerEmail}
                  </a>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <a href={`tel:${selectedInquiry.customerPhone}`} className="text-primary hover:underline">
                    {selectedInquiry.customerPhone}
                  </a>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">WhatsApp</p>
                  <a
                    href={`https://wa.me/${selectedInquiry.customerWhatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Send Message
                  </a>
                </div>
              </div>

              {/* Listing Info */}
              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Interested In</p>
                  <p className="font-medium text-sm">{selectedInquiry.listingTitle}</p>
                  <p className="text-primary font-bold">{formatPrice(selectedInquiry.listingPrice)}</p>
                </div>

                {selectedInquiry.preferredViewingDate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Preferred Viewing Date</p>
                    <p className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedInquiry.preferredViewingDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Status & Assignment */}
              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Status</p>
                  <Select defaultValue={selectedInquiry.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="viewing_scheduled">Viewing Scheduled</SelectItem>
                      <SelectItem value="negotiating">Negotiating</SelectItem>
                      <SelectItem value="closed_won">Closed - Won</SelectItem>
                      <SelectItem value="closed_lost">Closed - Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Assigned To</p>
                  <Select defaultValue={selectedInquiry.assignedTo || ""}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      <SelectItem value="agent1">Agent 1</SelectItem>
                      <SelectItem value="agent2">Agent 2</SelectItem>
                      <SelectItem value="agent3">Agent 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Notes</p>
                <div className="space-y-2 mb-3">
                  {selectedInquiry.notes.map((note, idx) => (
                    <div key={idx} className="bg-muted p-2 rounded text-sm">
                      {note}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a note..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    rows={3}
                    className="text-sm"
                  />
                </div>
                <Button
                  onClick={handleAddNote}
                  className="w-full mt-2 bg-primary text-primary-foreground"
                  size="sm"
                >
                  Add Note
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
