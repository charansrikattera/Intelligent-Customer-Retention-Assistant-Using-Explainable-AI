import pandas as pd
import joblib

from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier

# Load dataset
df = pd.read_csv("bank_churn_india.csv")

# Features
NUM_FEATURES = [
    'CIBIL_Score', 'Age', 'Tenure', 'Account_Balance',
    'NumOfProducts', 'HasCrCard', 'Digital_Active', 'Monthly_Income'
]

CAT_FEATURES = ['Geography', 'Gender']

X = df[NUM_FEATURES + CAT_FEATURES]
y = df['Exited']   # Churn column

# Preprocessing
preprocessor = ColumnTransformer([
    ('num', 'passthrough', NUM_FEATURES),
    ('cat', OneHotEncoder(handle_unknown='ignore'), CAT_FEATURES)
])

# Pipeline
pipeline = Pipeline([
    ('preprocess', preprocessor),
    ('model', RandomForestClassifier(
        n_estimators=200,
        random_state=42
    ))
])

pipeline.fit(X, y)

joblib.dump(pipeline, "model/churn_pipeline.pkl")

print("✅ Model trained and saved successfully")
