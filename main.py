from src.data_preprocessing import load_and_clean_data
from src.feature_engineering import split_and_scale
from src.model_training import train_logistic, train_random_forest
from src.model_evaluation import evaluate_model

df = load_and_clean_data("data/raw_data.csv")

X_train, X_test, y_train, y_test = split_and_scale(df)

log_model = train_logistic(X_train, y_train)
rf_model = train_random_forest(X_train, y_train)

print("Logistic Regression Results")
evaluate_model(log_model, X_test, y_test)

print("Random Forest Results")
evaluate_model(rf_model, X_test, y_test)
