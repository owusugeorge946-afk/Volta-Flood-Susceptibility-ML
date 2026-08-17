// VOLTA RIVER BASIN FLOOD-SUSCEPTIBILITY — GEE PREDICTOR EXPORT
// Clean reconstruction of the final physically informed workflow.
// AOI used in the study:
var aoi=ee.FeatureCollection('projects/ee-owusugeorge946/assets/VOLTA_RIVER_BASIN');
var geom=aoi.geometry(), SCALE=1000, FOLDER='VOLTA_FLOOD_FINAL_EXPORTS';
var START='2001-01-01', END='2025-12-31';
Map.centerObject(aoi,6);

// Terrain
var dem=ee.Image('USGS/SRTMGL1_003').select('elevation').clip(geom).rename('elevation');
var slope=ee.Terrain.slope(dem).rename('slope');
var merit=ee.Image('MERIT/Hydro/v1_0_1').clip(geom);
var hand=merit.select('hnd').rename('HAND');
var upa=merit.select('upa');
var logfa=upa.max(1e-6).log10().rename('log_flow_accumulation');
var rel=dem.subtract(dem.focal_min({radius:5000,units:'meters'})).rename('relative_elevation');
var twi=upa.max(1e-6).divide(slope.multiply(Math.PI/180).tan().max(.001)).log().rename('TWI');

// Drainage controls
var river=merit.select('wth').gt(0).selfMask();
var dist=river.fastDistanceTransform(1024,'pixels','squared_euclidean').sqrt().multiply(90).rename('distance_to_river');
var dd=river.unmask(0).reduceNeighborhood({reducer:ee.Reducer.mean(),kernel:ee.Kernel.circle({radius:5000,units:'meters'})}).multiply(1000).rename('drainage_density');

// CHIRPS
var chirps=ee.ImageCollection('UCSB-CHG/CHIRPS/DAILY').filterDate(START,END).filterBounds(geom).select('precipitation');
var years=ee.List.sequence(2001,2025);
var annual=ee.ImageCollection.fromImages(years.map(function(y){return chirps.filter(ee.Filter.calendarRange(y,y,'year')).sum();})).mean().rename('annual_rainfall');
var rx1=ee.ImageCollection.fromImages(years.map(function(y){return chirps.filter(ee.Filter.calendarRange(y,y,'year')).max();})).mean().rename('Rx1day');
function rolling(days){
 var list=chirps.toList(chirps.size()), n=chirps.size();
 return ee.ImageCollection.fromImages(ee.List.sequence(0,n.subtract(days)).map(function(i){
   i=ee.Number(i); return ee.ImageCollection(list.slice(i,i.add(days))).sum();
 }));
}
var rx5=rolling(5).max().rename('Rx5day');
var max30=rolling(30).max().rename('max30day_rainfall');

// Vegetation, land cover, soil
var ndvi=ee.ImageCollection('MODIS/061/MOD13Q1').filterDate(START,END).filterBounds(geom).select('NDVI').mean().multiply(.0001).rename('NDVI').clip(geom);
var lc=ee.ImageCollection('ESA/WorldCover/v100').first().select('Map').rename('landcover').clip(geom);
var clay=ee.Image('OpenLandMap/SOL/SOL_CLAY-WFRACTION_USDA-3A1A1A_M/v02').select(0).rename('clay').clip(geom);

// Persistent water
var water=ee.Image('JRC/GSW1_4/GlobalSurfaceWater').select('occurrence').gte(90).rename('permanent_water').clip(geom);

// 15 predictors
var predictors=ee.Image.cat([dem,dist,dd,lc,clay,ndvi,hand,annual,max30,rel,slope,rx5,rx1,twi,logfa]).toFloat().clip(geom);
print('Predictors',predictors.bandNames(),predictors.bandNames().size());

Export.image.toDrive({image:predictors,description:'Volta_15_Predictors_1km',folder:FOLDER,fileNamePrefix:'Volta_15_Predictors_1km',region:geom,scale:SCALE,maxPixels:1e13,fileFormat:'GeoTIFF'});
Export.image.toDrive({image:water.toByte(),description:'Volta_Permanent_Water_Mask_1km',folder:FOLDER,fileNamePrefix:'Volta_Permanent_Water_Mask_1km',region:geom,scale:SCALE,maxPixels:1e13,fileFormat:'GeoTIFF'});
Export.table.toDrive({collection:aoi,description:'Volta_River_Basin_Boundary',folder:FOLDER,fileNamePrefix:'Volta_River_Basin_Boundary',fileFormat:'SHP'});
