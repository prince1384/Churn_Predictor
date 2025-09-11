import pandas as pd

def save_csv(df, path):
    df.to_csv(path, index=False)

def load_csv(path):
    return pd.read_csv(path)
