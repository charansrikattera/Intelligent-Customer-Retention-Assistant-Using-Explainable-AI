import pandas as pd

def load_and_clean_data(path):
    df = pd.read_csv(path)

    df.drop(['CustomerId'], axis=1, inplace=True)

    df['Gender'] = df['Gender'].map({'Male': 1, 'Female': 0})
    df = pd.get_dummies(df, columns=['Geography'], drop_first=True)

    return df
