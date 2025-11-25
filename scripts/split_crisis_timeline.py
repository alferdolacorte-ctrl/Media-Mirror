import json

import pandas as pd

from pathlib import Path



INPUT = "data/crisis_timeline.json"

OUTPUT_DIR = Path("data/crisis_pages")

PAGE_SIZE = 100



def main():

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)



    with open(INPUT, "r", encoding="utf-8") as f:

        data = json.load(f)



    df = pd.DataFrame(data)

    total = len(df)

    num_pages = (total + PAGE_SIZE - 1) // PAGE_SIZE



    print(f"Total messages: {total}, pages: {num_pages}")



    for page in range(num_pages):

        start = page * PAGE_SIZE

        end = start + PAGE_SIZE

        page_df = df.iloc[start:end]

        filename = OUTPUT_DIR / f"crisis_timeline_page_{page+1}.csv"

        page_df.to_csv(filename, index=False)

        print(f"Saved {filename}")



if __name__ == "__main__":

    main()
