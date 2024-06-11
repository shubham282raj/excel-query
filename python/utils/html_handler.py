from bs4 import BeautifulSoup
import numpy as np
import pandas as pd

def html_to_excel(url, output):
  with open(url, 'r', encoding='utf-8') as file:
      html_content = file.read()

  soup = BeautifulSoup(html_content, 'html.parser')

  table = soup.find('table')

  list = []
  if table:
      rows = table.find_all('tr')
      for row in rows:
          cells = row.find_all(['td', 'th'])
          row_data = []
          for cell in cells:
              row_data.append(cell.text.strip())
          list.append(row_data)
  header = list[0]
  arr = np.array(list[1:], dtype=str)

  df = pd.DataFrame(arr)
  df.columns = header
  df.to_excel(f"{output}.xlsx", index=False)