# zeephyr index

Scraping, parsing, storing and distributing furry content over the web with always-free and near-limitless api

## TODOs

- [x] Rewrite e621's Reconciler to store post information in redis instead of plain-old JavaScript objects
- [ ] Add more ~~reconcilers~~ and scrappers
    - [ ] FurAffinity ~~reconciler*~~ and scraper
    - [ ] SoFurry ~~reconciler*~~ and scraper

    _*_ This reconciler will be much harder to do, considering that this website doesn't provide some magical thingie like e621's database export archive.
- [ ] Investigate the possibility of adding these ~~reconcilers~~ and scrapers:
    - [ ] DeviantArt
    - [ ] ArchiveOfOurOwn
    - [ ] FurryNetwork
    - [ ] r/furry_irl _(or other furry-related reddit source)_
    - [ ] Twitter?
    - [ ] Weasyl
    - [ ] InkBunny
- [ ] Add automatic drone pipeline to deploy landing app to Vercel

## Updates

19.06.2023 - After some investigation I've decided to remove reconciler ideas for now and focus only on scraping and distributing scraped content via events using webhooks to interested parties.