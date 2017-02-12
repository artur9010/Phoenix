# Phoenix
[![Code Climate](https://codeclimate.com/github/artur9010/Phoenix/badges/gpa.svg)](https://codeclimate.com/github/artur9010/Phoenix)
[![Issue Count](https://codeclimate.com/github/artur9010/Phoenix/badges/issue_count.svg)](https://codeclimate.com/github/artur9010/Phoenix)
[![](https://img.shields.io/badge/Available%20for-OS%20X%2C%20Windows%2C%20Linux-blue.svg)](https://github.com/artur9010/Phoenix/releases)

## Download
All binaries available in [Releases](https://github.com/artur9010/Phoenix/releases/latest).

## Screenshoots
![Login screen](http://i.imgur.com/svxQ9nM.png)
![After login screen?](http://i.imgur.com/KT4HNIc.png)
![After login screen 2?](http://i.imgur.com/PtTwz1B.png)

## Installing
#### Windows
Download .zip package from [Releases](https://github.com/artur9010/Phoenix/releases/latest), extract it and run .exe.
#### Linux
Download .zip package from [Releases](https://github.com/artur9010/Phoenix/releases/latest), extract it and run binary.
#### OS X/macOS
Download .zip package from [Releases](https://github.com/artur9010/Phoenix/releases/latest), extract it and run application (you can move it to Applications).

## Building
### For testing
```
npm run -s build
```
### For production
```
npm run -s prod
```
### For specific platform
```
npm run -s build PLATFORM ARCH
```

Here is the list of available platforms:
 - `mac` | `m` | `darwin`
 - `linux` | `l`
 - `windows` | `w` | `win32`
 - `all` | `a`

And there is the list of architectures:
 - `x64`
 - `ia32`
 - `armv7l`
 - `all` | `a`
