# Spatially Validated Machine-Learning Flood Susceptibility Assessment in the Volta River Basin Using Extreme Rainfall and Multi-Source Geospatial Data

## Authors

**George Owusu Amoah¹,* · Francis Quayson²,³ · Crispin Awodanzo Ajugu⁴**

¹ Department of Geography and Regional Planning, University of Cape Coast, Cape Coast, Ghana; george.amoah003@stu.ucc.edu.gh  
² Department of Land Surveying and Geospatial Science, The Hong Kong Polytechnic University, Hong Kong, China  
³ Research Institute for Land and Space, The Hong Kong Polytechnic University, Hong Kong, China  
⁴ Department of Geography and Environmental Studies, New Mexico State University, USA; ajuguc@nmsu.edu  

**Corresponding author:** George Owusu Amoah — george.amoah003@stu.ucc.edu.gh

## Overview

This repository contains the code for the redesigned, physically informed and spatially validated machine-learning flood-susceptibility assessment for the Volta River Basin.

## Final study design

- 15 terrain, drainage, rainfall, vegetation, land-cover and soil predictors
- 5,000 flood and 5,000 non-flood reference observations
- 3-km negative-sample exclusion and persistent-water removal
- 0.5° spatial validation blocks
- 127 training groups and 43 independent holdout groups
- Random Forest and XGBoost
- Random Forest predictor importance and SHAP interpretation
- Basin-wide flood-susceptibility probability and five susceptibility classes

## Repository structure

- `gee/Volta_Flood_Predictor_Export.js` — Google Earth Engine predictor preparation and export
- `colab/Volta_Flood_ML_Analysis.ipynb` — model training, spatial validation, interpretation and basin-wide prediction
- `requirements.txt` — Python dependencies
- `LICENSE` — software license

## Reported final model performance

Random Forest achieved 95.26% accuracy, 95.06% balanced accuracy, 97.46% precision, 92.20% sensitivity, 97.92% specificity, F1 = 0.9476, ROC-AUC = 0.9923 and average precision = 0.9906.

XGBoost achieved 94.95% accuracy and ROC-AUC = 0.9901.

## Reproducibility note

This repository is a cleaned reconstruction from the final analysis record. The exact historical random seed, model hyperparameters, flood-inventory Earth Engine asset ID and final susceptibility-class thresholds were not recoverable. These items are therefore explicitly marked as configurable or reconstructed values in the code rather than being presented as verified historical settings.

A rerun should not be claimed to reproduce the reported metrics exactly unless the original configuration is recovered and the resulting performance matches the reported analysis.

## Correspondence

George Owusu Amoah  
Department of Geography and Regional Planning  
University of Cape Coast, Cape Coast, Ghana  
Email: george.amoah003@stu.ucc.edu.gh
