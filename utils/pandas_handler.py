import pandas as pd

def filter_int_ranks(url):
  df = pd.read_excel(url)
  df = df[~(df.iloc[:, 5].str.contains('P') | df.iloc[:, 6].str.contains('P'))]
  df.iloc[:, [5, 6]] = df.iloc[:, [5, 6]].astype(float).astype(int)
  return df