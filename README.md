# Kawa - Anime streaming app.

## 🚧 Currently Under Development 🚧

The core functionality of the app is largely complete, though it may lack some features users typically expect from an anime streaming app. While Windows builds are available for download, MacOS and Linux users will need to build the app themselves.

# About

**Problem:** Current anime sites are crap, and they go down constantly.

**Solution:** A standalone app where extensions provide the content (currently supporting torrent sources only). Your anime list is synced with [MAL](https://myanimelist.net/) and watch progress is saved in app. Enjoy anime without ads with amazing quality and without the risk of the site going down.

# Development

All you should need is Node.js and yarn. Setup the .env file with .env.example guide and run `yarn install` and `yarn dev` to start the app.

# What needs to be done?

- Auto delete torrents when done seeding/watching.
- Fix subtitle rendering, auto selection, UI.
- Create more extensions for different sources.
- Make builds for MacOS and Linux.
- Support multi episode torrents.
- Recognize when video format is not supported on Electron/Chromium. (Add ability to open in VLC)
- Complete settings page.
- Add more anime discovery features.
- Support other anime tracking services (AniList, Kitsu).
- General extension/renderer/main process system cleanup.

# Acknowledgements

A big thanks to [ThaUnknown](https://github.com/ThaUnknown) for writing and open-sourcing the libraries that made this app possible:

- [jassub](https://github.com/ThaUnknown/jassub) – for enabling integration of ASS subtitles.
- [matroska-metadata](https://github.com/ThaUnknown/matroska-metadata) – for handling Matroska metadata.
- [anitomyscript](https://github.com/ThaUnknown/anitomyscript) – javascript bindings for [Anitomy](https://github.com/erengy/anitomy).

Check out ThaUnknown's streaming app alternative [miru](https://github.com/ThaUnknown/miru).
