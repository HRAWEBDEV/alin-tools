# Alin UI Manual Deployment Instructions

this readme file contains steps to manually deploy alin ui on a server.

## Steps

### Install Node js

install node js version > 20 from node js site for your platform.

open [nodejs website](https://nodejs.org/en) to download node js

### Clone or Download project

clone or download ui project and transfer it to your server

### Open command line and cd to ui directory

after that open your command line (powershell or bash) and change your directory to ui project root. after that run ls command and if you see package.json file then you are in ui project directory

### npm install

to install project dependencies execute npm install

```bash
npm install
```

### Change api address

ui program uses api base address which is saved in .env.production . you can change the address to whatever address that alin backend is running on.

```env
NEXT_PUBLIC_API_URI=http://192.168.100.8/API
```

### npm run build

execute

```bash
npm run build
```

command and wait until the project is built completely

### Remove unnecessary files

after building the project you can remove all files except node_modules and next and package.json files

do not remove these files or folders:

- node_modules
- next
- package.json

### npm start

for the last step execute

```bash
npm run start
```

programm default port is 3000 (if not in use)

you can change the start command in package json and pass the -p <port-number> optionally to change the deployment port

```bash
'start':'next start -p 3000'
```
