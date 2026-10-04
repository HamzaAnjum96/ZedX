#!/usr/bin/env python3
"""Collect public feedback about the category leaders (Jira, Trello) into
replica/reviews.csv for replica-entrepreneur's reviews.py.

Official public feeds only, as the skill allows:
  - Apple's customer reviews RSS feed (UK store), most recent first
  - the Hacker News Algolia API, comments, newest first

About twenty requests in total, run by hand once. Every row keeps the exact
text (HTML entities decoded, tags removed) and a link. Nothing is invented,
nothing is paraphrased. Standard library only.

    python3 replica/collect_feedback.py            # writes replica/reviews.csv
"""

import csv
import datetime as dt
import html
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parent / "reviews.csv"
UA = {"User-Agent": "replica-entrepreneur research (one-off, by hand)"}

APP_STORE = {
    # app id: name. UK store, newest first, 3 pages of 50.
    "1006972087": "jira-cloud-ios",
    "461504587": "trello-ios",
}

HN_QUERIES = [
    "jira slow",
    "jira complicated",
    "jira configuration",
    "jira bloated",
    "jira admin",
    "jira per user pricing",
    "jira micromanagement",
    "jira bureaucracy",
    "trello limited",
    "trello scale",
    "trello reporting",
    "trello too simple",
    "story points velocity management",
]
HN_SINCE = int(dt.datetime(2024, 1, 1, tzinfo=dt.timezone.utc).timestamp())


def get_json(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def plain(text):
    text = re.sub(r"<p>|<br\s*/?>", "\n", text or "", flags=re.I)
    text = re.sub(r"<[^>]+>", "", text)
    return html.unescape(text).strip()


def app_store_rows():
    rows = []
    for app_id, name in APP_STORE.items():
        for page in (1, 2, 3):
            url = ("https://itunes.apple.com/gb/rss/customerreviews/page=%d/id=%s/"
                   "sortBy=mostRecent/json" % (page, app_id))
            try:
                feed = get_json(url).get("feed", {})
            except Exception as exc:  # report, never guess
                print("could not read %s page %d: %s" % (name, page, exc))
                continue
            for entry in feed.get("entry", []):
                if "im:rating" not in entry:
                    continue  # the first entry can be the app itself
                link = entry.get("link", {}).get("attributes", {}).get("href", "")
                title = entry.get("title", {}).get("label", "")
                body = entry.get("content", {}).get("label", "")
                rows.append({
                    "source": "app-store-" + name,
                    "url": link,
                    "date": entry.get("updated", {}).get("label", "")[:10],
                    "rating": entry.get("im:rating", {}).get("label", ""),
                    "text": (title + ". " + body).strip(),
                })
            time.sleep(1)
    return rows


def hn_rows():
    rows = []
    for query in HN_QUERIES:
        params = urllib.parse.urlencode({
            "query": query,
            "tags": "comment",
            "hitsPerPage": 40,
            "numericFilters": "created_at_i>%d" % HN_SINCE,
        })
        url = "https://hn.algolia.com/api/v1/search_by_date?" + params
        try:
            hits = get_json(url).get("hits", [])
        except Exception as exc:
            print("could not read HN for %r: %s" % (query, exc))
            continue
        for hit in hits:
            text = plain(hit.get("comment_text"))
            if not re.search(r"\b(jira|trello|story points?)\b", text, re.I):
                continue
            rows.append({
                "source": "hacker-news",
                "url": "https://news.ycombinator.com/item?id=%s" % hit["objectID"],
                "date": (hit.get("created_at") or "")[:10],
                "rating": "",
                "text": text,
            })
        time.sleep(1)
    return rows


def main():
    rows = app_store_rows() + hn_rows()
    seen, unique = set(), []
    for row in rows:
        key = row["url"] + "|" + row["text"][:80]
        if key in seen:
            continue
        seen.add(key)
        unique.append(row)
    with OUT.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=["source", "url", "date", "rating", "text"])
        writer.writeheader()
        writer.writerows(unique)
    by_source = {}
    for row in unique:
        by_source[row["source"]] = by_source.get(row["source"], 0) + 1
    print("wrote %d rows to %s: %s" % (len(unique), OUT.name, by_source))


if __name__ == "__main__":
    main()
