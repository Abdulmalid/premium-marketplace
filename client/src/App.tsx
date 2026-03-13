import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import HomePage from "./pages/Home";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInventory from "./pages/AdminInventory";
import AdminLeads from "./pages/AdminLeads";
import AdminSettings from "./pages/AdminSettings";
import AdminAddListing from "./pages/AdminAddListing";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={HomePage} />
      <Route path={"/listings"} component={Listings} />
      <Route path={"/listings/:id"} component={ListingDetail} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/inventory"} component={AdminInventory} />
      <Route path={"/admin/leads"} component={AdminLeads} />
      <Route path={"/admin/settings"} component={AdminSettings} />
      <Route path={"/admin/add-listing"} component={AdminAddListing} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
