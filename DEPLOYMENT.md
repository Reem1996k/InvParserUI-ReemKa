# Deployment Guide

This guide covers deploying the Invoice Parser Frontend to production environments.

## Local Development

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
git clone <repository-url>
cd InvParserUI-ReemKa
npm install
```

### Configuration
Create or update `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Running Development Server
```bash
npm run dev
```
Application starts at `http://localhost:3000`.

### Building for Production
```bash
npm run build
npm start
```

## Deployment Environments

### Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Steps:
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_BASE_URL`: Your production backend URL
4. Deploy (automatic on git push)

#### Environment Variables in Vercel:
```
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

### Docker Deployment

#### Dockerfile
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
```

#### Building and Running
```bash
docker build -t invoice-parser-ui .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=http://backend:8080 invoice-parser-ui
```

### AWS Deployment

#### Using AWS Amplify
```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

#### Using EC2
1. Launch EC2 instance (Ubuntu 20.04 recommended)
2. Install Node.js: `sudo apt-get install nodejs npm`
3. Clone repository and install dependencies
4. Configure `.env.local`
5. Build: `npm run build`
6. Start: `npm start` or use PM2

### DigitalOcean Deployment

#### Using DigitalOcean App Platform
1. Connect GitHub repository
2. Select Node.js runtime
3. Set environment variables
4. Deploy

#### Manual VPS Deployment
1. Create Droplet (Ubuntu 20.04)
2. SSH into server
3. Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -`
4. Install and start application

### Heroku Deployment

#### Note: Heroku deprecated free tier

If using Heroku with paid plan:

1. Create Procfile:
```
web: npm start
```

2. Deploy:
```bash
heroku login
heroku create your-app-name
heroku config:set NEXT_PUBLIC_API_BASE_URL=your-api-url
git push heroku main
```

## Production Configuration

### Environment Variables

Required variables for production:

```env
# Backend API URL (must be publicly accessible from frontend)
NEXT_PUBLIC_API_BASE_URL=https://api.example.com

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Optional: Error tracking
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Build Optimization

The project includes optimizations:
- SWC minification enabled
- Automatic code splitting
- Image optimization ready
- CSS optimization via Tailwind

### Performance Best Practices

1. **Enable Compression**: Configure web server to gzip responses
2. **Set Cache Headers**: 
   - Static assets: 1 year
   - JavaScript: 1 day
   - HTML: no-cache
3. **CDN**: Use CDN for static assets
4. **Database**: Optimize backend API response times

### Security Considerations

#### Headers
Configure headers in `next.config.js` or web server:
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

#### HTTPS
- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Set HSTS header

#### CORS
Ensure backend is configured with proper CORS:
```
Access-Control-Allow-Origin: https://yourdomain.com
Access-Control-Allow-Methods: GET, POST, OPTIONS
```

#### Content Security Policy
Add CSP headers to `next.config.js`:
```javascript
const headers = async () => [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline'"
  }
]
```

## Database & Storage

This frontend application doesn't use a database. All data is:
- Fetched from backend API
- Not persisted locally
- Managed server-side only

## Monitoring & Logging

### Application Monitoring
- Set up uptime monitoring (Pingdom, UptimeRobot)
- Monitor error rates
- Track page load times

### Error Tracking
Integrate error tracking (optional):
- Sentry
- LogRocket
- Rollbar

### Analytics
Consider adding analytics:
- Google Analytics
- Mixpanel
- PostHog

## Scaling

### Horizontal Scaling
Next.js applications scale horizontally well:
- Deploy multiple instances
- Use load balancer
- Share nothing (stateless design)

### CDN Optimization
- Serve static assets from CDN
- Cache static pages at edge
- Minimize JavaScript bundles

## Maintenance & Updates

### Updates
```bash
npm update
npm audit fix
npm run build
npm test (if tests added)
```

### Version Management
- Keep Node.js up to date
- Update dependencies regularly
- Monitor security advisories

### Backups
- No database to backup
- Repository is single source of truth
- Use git for version control

## Troubleshooting

### Build Fails
1. Check Node.js version: `node --version` (should be 18+)
2. Clear cache: `rm -rf .next node_modules package-lock.json`
3. Reinstall: `npm install`
4. Rebuild: `npm run build`

### Runtime Errors
1. Check `.env.local` configuration
2. Verify backend API is accessible
3. Check application logs

### Performance Issues
1. Check browser DevTools Network tab
2. Monitor backend API response times
3. Analyze bundle size: `npm run analyze`

### CORS Errors
1. Verify backend CORS headers
2. Check allowed origins in backend
3. Verify API URL in `.env.local`

## Production Deployment Checklist

- [ ] Environment variables configured
- [ ] Backend API URL set correctly
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Error tracking configured
- [ ] Analytics configured (optional)
- [ ] Uptime monitoring enabled
- [ ] Backup strategy in place
- [ ] Documentation updated

## Support & Help

For deployment issues:
1. Check NextJS docs: https://nextjs.org/docs/deployment
2. Review application logs
3. Check backend connectivity
4. Monitor error tracking service

## Rollback Procedure

If deployment fails:

### Vercel
- Automatic rollback to previous build
- Deployments > select previous version > Promote

### Docker
```bash
docker ps  # Find container
docker stop <container-id>
docker run <previous-image-id>
```

### Manual Server
```bash
git revert <commit-hash>
npm run build
npm start
```

## Disaster Recovery

### Code Loss
- Repository backed up on GitHub/GitLab
- Revert to known good commit

### Server Loss
- Redeploy from repository
- No data loss (no database)
- Restore from deployment platform

### API Unavailability
- Frontend will show error notifications
- Add fallback UI or maintenance page
- Notify users of issue
