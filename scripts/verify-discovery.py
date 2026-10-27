import json, os, re, xml.etree.ElementTree as ET

ROOT = os.path.expanduser("~/Hoardy_2026/hoardy-website/out")

print("--- XML well-formedness")
for rel in ["sitemap.xml", "blog/rss.xml", "rss.xml"]:
    p = os.path.join(ROOT, rel)
    try:
        ET.parse(p)
        print(f"  OK   {rel} parses")
    except Exception as e:
        print(f"  FAIL {rel}: {e}")

print("\n--- sitemap URLs")
tree = ET.parse(os.path.join(ROOT, "sitemap.xml"))
ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
for u in tree.getroot().findall("s:url", ns):
    loc = u.find("s:loc", ns).text
    lm = u.find("s:lastmod", ns).text
    print(f"  {lm}  {loc}")

print("\n--- rss items")
tree = ET.parse(os.path.join(ROOT, "blog/rss.xml"))
for it in tree.getroot().iter("item"):
    print("  ", it.find("pubDate").text, "|", it.find("title").text)

print("\n--- llms.txt (head)")
print(open(os.path.join(ROOT, "llms.txt"), encoding="utf-8").read()[:1100])

print("\n--- article mirrors + FAQ counts")
for slug in os.listdir(os.path.join(ROOT, "blog")):
    if slug.endswith(".md"):
        print("  ", slug, os.path.getsize(os.path.join(ROOT, "blog", slug)), "B")

# FAQ counts from the two exported articles
for slug in ["the-agentic-era-building-ai-agents-in-canada", "the-bar-for-writing-software-just-fell"]:
    p = os.path.join(ROOT, "blog", slug, "index.html")
    h = open(p, encoding="utf-8").read()
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', h, re.S):
        b = json.loads(m.group(1))
        if b.get("@type") == "FAQPage":
            print(f"  {slug}: FAQPage with {len(b['mainEntity'])} Q&A")
