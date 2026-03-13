# Quick Start Guide - Set Up Your Own Marketplace

This guide will help you get your Premium Property & Auto Marketplace up and running in minutes.

## 5-Minute Setup

### Step 1: Access Your Project

1. Log in to your Manus account
2. Navigate to your "premium-marketplace" project
3. Click "View" to see the live preview

### Step 2: Configure Basic Settings

1. Go to **Settings > General**
2. Update your business name (VITE_APP_TITLE)
3. Upload your logo (VITE_APP_LOGO)
4. Set your contact information

### Step 3: Add Your First Listing

1. Click **Admin** in the top navigation
2. Go to **Inventory > Add Listing**
3. Follow the 5-step wizard:
   - **Step 1**: Select category (Real Estate, Vehicle, Land, Commercial)
   - **Step 2**: Enter title, description, and price
   - **Step 3**: Upload property/vehicle images (drag & drop)
   - **Step 4**: Enter location details
   - **Step 5**: Review and publish

### Step 4: Customize Appearance

Edit `client/src/index.css` to change:
- Primary color (currently: #1a1a2e)
- Accent color (currently: #d4af37)
- Font families
- Spacing and sizing

### Step 5: Go Live

1. Create a checkpoint: **Settings > Save Checkpoint**
2. Publish to production: **Publish button** in header
3. Configure your domain: **Settings > Domains**

---

## Key Features at a Glance

### For Customers (Public Site)

| Feature | Location | How to Use |
|---------|----------|-----------|
| **Browse Listings** | `/listings` | Filter by category, price, location; search by keyword |
| **View Details** | `/listings/:id` | See full specs, gallery, virtual tour, agent info |
| **Make Inquiry** | Listing detail page | Fill form, choose WhatsApp or email contact |
| **Search** | Homepage | Quick search by location or property type |

### For Admins (Admin Panel)

| Feature | Location | How to Use |
|---------|----------|-----------|
| **Dashboard** | `/admin` | View analytics, recent activity, key metrics |
| **Add Listing** | `/admin/add-listing` | 5-step wizard to create new listings |
| **Inventory** | `/admin/inventory` | Manage all listings, bulk actions, status updates |
| **Leads** | `/admin/leads` | Track inquiries, assign to team, manage pipeline |
| **Settings** | `/admin/settings` | Configure business info, notification preferences |

---

## Common Tasks

### Add a New Property Listing

```
1. Go to /admin/add-listing
2. Select "Real Estate" category
3. Choose subcategory (Apartment, House, Villa, etc.)
4. Fill in property details:
   - Title: "Luxury 5-Bedroom Villa in Lekki Phase 1"
   - Description: Detailed features and amenities
   - Price: ₦250,000,000
5. Upload 5-10 high-quality images
6. Add location: "Lekki Phase 1, Lagos"
7. Add virtual tour URL (optional)
8. Mark as "Featured" for premium visibility
9. Click "Publish Listing"
```

### Add a Vehicle Listing

```
1. Go to /admin/add-listing
2. Select "Vehicle" category
3. Choose subcategory (Sedan, SUV, Truck, Van)
4. Fill in vehicle details:
   - Title: "Mercedes-Benz GLE 2023 - Excellent Condition"
   - Description: Mileage, features, service history
   - Price: ₦45,000,000
5. Upload 8-12 photos (exterior, interior, details)
6. Add location: Where vehicle is located
7. Publish
```

### Respond to Customer Inquiries

```
1. Go to /admin/leads
2. View inquiries in the pipeline:
   - New: Just received
   - Contacted: You've reached out
   - Viewing Scheduled: Customer appointment set
   - Negotiating: Price discussion ongoing
   - Closed: Deal completed or abandoned
3. Click on inquiry to view details
4. Add notes or change status
5. Send message via WhatsApp directly from the app
```

### Update Listing Status

```
1. Go to /admin/inventory
2. Find listing in table
3. Click "Status" dropdown
4. Choose new status:
   - Available: Open for inquiries
   - Pending: Under negotiation
   - Reserved: Held for specific buyer
   - Sold: Transaction completed
5. Status automatically updates on public site
```

### Feature a Listing (Premium Visibility)

```
1. Go to /admin/add-listing (or edit existing)
2. Check "Feature this listing" checkbox
3. Featured listings appear:
   - At top of search results
   - On homepage featured section
   - In email newsletters
4. Cost: Included in your plan
```

---

## Customization Guide

### Change Colors

Edit `client/src/index.css`:

```css
@layer base {
  :root {
    --primary: 26 26 46; /* Your primary color in RGB */
    --primary-foreground: 255 255 255;
    --accent: 212 175 55; /* Your accent color */
    /* ... other colors ... */
  }
}
```

### Change Fonts

Edit `client/index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap" rel="stylesheet">
```

Then update `client/src/index.css`:

```css
@layer base {
  :root {
    --font-sans: "Your Font", sans-serif;
  }
}
```

### Add Your Company Logo

1. Upload logo to S3 or use CDN URL
2. Go to Settings > General
3. Paste logo URL in VITE_APP_LOGO
4. Logo appears in header and footer

### Customize Homepage

Edit `client/src/pages/Home.tsx`:
- Change hero headline and subheading
- Update featured listings section
- Modify value propositions
- Add testimonials or reviews

---

## Integration Checklist

### Before Going Live

- [ ] Update business name and logo
- [ ] Add at least 5 listings
- [ ] Set up WhatsApp Business Account (for messaging)
- [ ] Configure email notifications
- [ ] Test inquiry form
- [ ] Verify all images load correctly
- [ ] Test admin login and dashboard
- [ ] Configure custom domain
- [ ] Set up analytics tracking
- [ ] Create privacy policy and terms
- [ ] Add contact information

### After Going Live

- [ ] Monitor analytics dashboard
- [ ] Respond to inquiries within 24 hours
- [ ] Update listings regularly
- [ ] Collect customer feedback
- [ ] Optimize based on performance data
- [ ] Plan marketing campaigns

---

## Pricing & Plans

### Included Features (All Plans)

- ✅ Unlimited listings
- ✅ Advanced filtering and search
- ✅ Image gallery with up to 10 images per listing
- ✅ WhatsApp inquiry integration
- ✅ Admin dashboard with analytics
- ✅ Real-time activity feed
- ✅ Role-based access (admin, editor, viewer)
- ✅ SSL/HTTPS included
- ✅ Automatic backups

### Premium Features (Add-ons)

| Feature | Price | Benefit |
|---------|-------|---------|
| **Featured Listings** | Included | Boost visibility in search |
| **Virtual Tours** | Included | 360° property views |
| **Email Campaigns** | $29/mo | Send newsletters to subscribers |
| **SMS Notifications** | $49/mo | Text alerts for new inquiries |
| **Advanced Analytics** | $19/mo | Detailed conversion tracking |
| **Team Management** | Included | Assign roles and permissions |

---

## Support & Help

### Getting Help

1. **Documentation**: Check DEPLOYMENT_GUIDE.md for detailed instructions
2. **FAQ**: Visit https://help.manus.im
3. **Live Chat**: Available in Manus dashboard
4. **Email**: support@manus.im

### Common Questions

**Q: How do I change my domain?**
A: Go to Settings > Domains, add your custom domain, and update DNS records.

**Q: Can I have multiple users?**
A: Yes! Go to Settings > Team to invite users with different roles.

**Q: How do I backup my data?**
A: Automatic daily backups are included. Download anytime from Settings > Backups.

**Q: Can I export listings?**
A: Yes, go to Admin > Inventory > Export CSV to download all listings.

**Q: How do I integrate with my CRM?**
A: Use the API endpoints documented in DEPLOYMENT_GUIDE.md.

---

## Next Steps

1. **Add More Listings** - Build your catalog
2. **Invite Team Members** - Share admin access
3. **Set Up Marketing** - Create email campaigns
4. **Analyze Performance** - Monitor analytics
5. **Expand Features** - Add custom integrations

---

## Pro Tips

💡 **Tip 1**: Use high-quality images - they increase inquiry rates by 40%

💡 **Tip 2**: Respond to inquiries quickly - within 1 hour for best conversion

💡 **Tip 3**: Feature your best listings - rotate featured properties weekly

💡 **Tip 4**: Keep descriptions detailed - include all important specifications

💡 **Tip 5**: Use WhatsApp for inquiries - faster response and higher engagement

---

**Ready to get started?** Go to your admin dashboard and create your first listing!

For detailed technical documentation, see: **DEPLOYMENT_GUIDE.md**
