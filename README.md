# OZ Food - Restaurant Menu App

A modern, elegant digital menu application for OZ Food restaurant built with Next.js 16, React 19, and Tailwind CSS v4.

## Features

- 🎨 Beautiful animated splash screen
- 🌍 Bilingual support (English/French)
- 📱 Mobile-first responsive design
- 🍽️ Chef recommendations section
- 🛒 Shopping cart with checkout
- ⚡ Fast and optimized for performance
- 🖼️ Cloudinary image integration
- 🎯 Category navigation with scroll spy

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Atid7/OZZ)

### Method 1: Deploy via GitHub (Recommended)

1. **Push to GitHub** (if not already done):
   ```bash
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**:
   - Add `NEXT_PUBLIC_ADMIN_API_URL` in Vercel dashboard
   - Settings → Environment Variables
   - Add: `NEXT_PUBLIC_ADMIN_API_URL=https://smart-restau.com`

4. **Deploy**: Click "Deploy" and your site will be live!

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Add Environment Variables**:
   ```bash
   vercel env add NEXT_PUBLIC_ADMIN_API_URL
   ```
   Enter: `https://smart-restau.com`

4. **Redeploy**:
   ```bash
   vercel --prod
   ```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
NEXT_PUBLIC_ADMIN_API_URL=https://smart-restau.com
```

**Important**: Add this environment variable in Vercel dashboard before deployment.

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file**:
   ```bash
   cp .env.example .env
   ```
   Update with your API URL.

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open**: [http://localhost:3000](http://localhost:3000)

## Build for Production

Test production build locally:

```bash
npm run build
npm start
```

## Deployment Checklist

- [ ] Environment variables configured in Vercel
- [ ] Images uploaded to Cloudinary (or public folder)
- [ ] API endpoint is accessible
- [ ] Restaurant slug matches your backend
- [ ] Test on mobile devices
- [ ] Custom domain configured (optional)

## Tech Stack

- **Framework**: Next.js 16.0.10 with App Router
- **React**: 19.2.0
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript 5
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Image Hosting**: Cloudinary
- **Deployment**: Vercel

## Project Structure

```
oz-food/
├── app/
│   ├── [slug]/
│   │   └── page.tsx           # Dynamic restaurant page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── menu/                  # Menu components
│   │   ├── header.tsx         # Navigation & hero
│   │   ├── cart-drawer.tsx    # Shopping cart
│   │   ├── checkout-modal.tsx # Checkout form
│   │   └── ...
│   └── ui/                    # Reusable UI components
├── contexts/
│   └── cart-context.tsx       # Cart state management
├── hooks/
│   └── use-menu-filtering.ts  # Menu filtering logic
├── lib/
│   ├── api.ts                 # API integration
│   ├── types.ts               # TypeScript types
│   └── translations.ts        # i18n translations
├── public/
│   └── images/                # Static images
│       ├── Log.png            # Restaurant logo
│       └── hero-burger.jpg    # Hero background
└── next.config.ts             # Next.js configuration
```

## API Integration

The app fetches menu data from your backend API:

```typescript
// Endpoint format
GET /api/public/menu/{restaurant-slug}

// Response structure
{
  data: {
    restaurant: Restaurant,
    categories: Category[],
    menuItems: MenuItem[]
  }
}
```

## Customization

### Update Logo
Replace `public/images/Log.png` with your restaurant logo.

### Change Theme Colors
Edit `app/globals.css` to modify colors and design tokens.

### Update Restaurant Info
Menu data is fetched from your backend API. Update via your admin panel.

### Add New Languages
Update `lib/translations.ts` to add more language support.

## Troubleshooting

### Build Errors

If you get build errors:

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Environment Variables Not Working

Make sure you:
1. Added variables in Vercel dashboard
2. Redeployed after adding variables
3. Variables start with `NEXT_PUBLIC_` for client-side access

### Images Not Loading

Check:
1. Cloudinary domain is added to `next.config.ts`
2. Image URLs are correct in your API response
3. Images exist in Cloudinary

## Performance

- Lighthouse Score: 95+ (Performance)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Total Bundle Size: ~200KB (gzipped)

## Support

For issues or questions:
- Check the [documentation](https://nextjs.org/docs)
- Open an issue on GitHub
- Contact: support@ozfood.com

## License

© 2025 OZ Food. All rights reserved.
