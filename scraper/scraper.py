import requests
from bs4 import BeautifulSoup
import json
import os

# --- CONFIGURATION ---
# IMPORTANT: Change these selectors for the actual news site if needed
NEWS_URLS = [
    'https://cointelegraph.com/tags/ai',  # AI related
    'https://cointelegraph.com/tags/cryptocurrency'  # Crypto related
]
ARTICLE_SELECTOR = 'article.post-card'
TITLE_SELECTOR = 'span.post-card__title'
LINK_SELECTOR = 'a.post-card__figure-link'
SUMMARY_SELECTOR = 'p.post-card__text'

# Define the output path relative to the backend folder
OUTPUT_PATH = '../backend/data/opportunities.json'

def scrape_news():
    """Scrapes the news sites and returns a list of opportunities."""
    opportunities = []
    for url, source_tag in zip(NEWS_URLS, ['Cointelegraph AI', 'Cointelegraph Crypto']):
        try:
            print(f"Fetching news from {url}...")
            response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
            response.raise_for_status()  # Raises an exception for bad status codes

            soup = BeautifulSoup(response.text, 'html.parser')
            articles = soup.select(ARTICLE_SELECTOR)[:5]  # Get latest 5 articles

            print(f"Found {len(articles)} articles from {url}.")

            for article in articles:
                title_element = article.select_one(TITLE_SELECTOR)
                link_element = article.select_one(LINK_SELECTOR)
                summary_element = article.select_one(SUMMARY_SELECTOR)

                if title_element and link_element:
                    title = title_element.get_text(strip=True)
                    link = link_element['href']
                    summary = summary_element.get_text(strip=True) if summary_element else "No summary available."

                    # Ensure the link is absolute
                    if not link.startswith('http'):
                        link = f"https://cointelegraph.com{link}"

                    opportunities.append({
                        'title': title,
                        'link': link,
                        'summary': summary,
                        'source': source_tag
                    })

        except requests.exceptions.RequestException as e:
            print(f"Error fetching the URL {url}: {e}")
        except Exception as e:
            print(f"An error occurred while processing {url}: {e}")

    return opportunities

def save_to_json(data):
    """Saves the scraped data to a JSON file."""
    # Ensure the directory exists
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"Data saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    scraped_data = scrape_news()
    if scraped_data:
        save_to_json(scraped_data)
    else:
        print("No data was scraped. The JSON file was not updated.")