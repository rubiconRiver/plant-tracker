# Plant Database API Research - 2025

## Problem
Need reliable plant data API for germination times, harvest times, and basic growing information for vegetable garden tracking app.

## Current Situation (January 2025)
- **OpenFarm**: Down (301 redirect, appears to be shut down)
- **Trefle**: Down/Being restored (unstable)
- Most free plant APIs either shut down or lack specific gardening data

## Viable Options Found

### 1. Perenual API ⭐ RECOMMENDED
- **URL**: https://perenual.com/docs/api
- **Coverage**: 10,000+ plant species
- **Pricing**: Has free tier (limits unclear) + paid plans
- **Data**: Plant care, watering, sunlight, growth info
- **Pros**: Free tier available, active API, good documentation
- **Cons**: May lack specific germination/harvest timing data
- **Status**: Active and working

### 2. API Farmer Plant Database
- **URL**: https://apifarmer.com/plant-database-api/
- **Coverage**: 100,000+ plant species
- **Pricing**: 
  - Worker Bee: €99/month (10k calls)
  - Honeycomb: €299/month (50k calls)  
  - Nectar: €499/month (unlimited)
  - 14-day trials: €11-22
- **Data**: Taxonomy, growth characteristics, requirements
- **Pros**: Comprehensive database, includes crops
- **Cons**: Expensive, unclear if includes germination/harvest times
- **Status**: Active

### 3. Harvest Helper API
- **URL**: http://harvesthelper.herokuapp.com/developers
- **Coverage**: 45 common vegetables
- **Pricing**: Appears free
- **Data**: Basic vegetable information
- **Pros**: Free, focused on vegetables
- **Cons**: Limited scope, unclear maintenance status
- **Status**: Unknown reliability

## Alternative Approaches

### Local Database Approach ⭐ STRONGLY RECOMMENDED
Given the limitations and costs of APIs, creating a local JSON database makes sense:

**Advantages:**
- No API costs or rate limits
- Reliable (offline access)
- Customizable for local climate
- Fast (no network requests)
- Complete data control

**Implementation:**
1. Create `/lib/plant-database.json` with 50-100 common vegetables
2. Include: germination days, harvest days, spacing, depth, temperature
3. Allow user overrides for local climate adjustments
4. Keep existing API code as fallback for exotic plants

**Sample Structure:**
```json
{
  "vegetables": {
    "tomato": {
      "name": "Tomato",
      "scientificName": "Solanum lycopersicum",
      "daysToGermination": [7, 14],
      "daysToHarvest": [60, 85],
      "spacing": "18-24 inches",
      "plantingDepth": "1/4 inch",
      "soilTemp": "65-85°F",
      "varieties": ["cherry", "beefsteak", "roma"],
      "companions": ["basil", "parsley"],
      "notes": "Warm season crop, start indoors 6-8 weeks before last frost"
    }
  }
}
```

## Recommendations

### Immediate Action:
1. **Try Perenual API** - Sign up for free tier to evaluate data quality
2. **Start building local database** - Begin with 20-30 common vegetables
3. **Hybrid approach** - Use Perenual for plant ID, local DB for timing data

### Long-term Strategy:
- Build comprehensive local vegetable database
- Keep API integration for plant identification features
- Allow users to contribute/edit timing data for crowdsourced improvements
- Consider partnering with local extension services for climate-specific data

## Data Sources for Local Database
- University extension services
- Seed company catalogs (Burpee, Johnny's Seeds, etc.)
- Gardening reference books
- USDA growing guides
- Old Farmer's Almanac

## Next Steps
1. Test Perenual API free tier
2. Create initial vegetable database JSON file
3. Update plant service to prioritize local data
4. Implement user override functionality

---
*Last updated: January 2025*