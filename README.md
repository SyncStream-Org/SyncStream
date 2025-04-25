# SyncStream

**SyncStream** is a self-hosted, all-in-one collaboration platform. Host private rooms for your clients supporing audio chat, synchronized media viewing, collaborative document editing, and file sharing — all while maintaining full control over your organization's data. 

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/4fbf9027d58743f1ab354d2fa686371e)](https://app.codacy.com/gh/SyncStream-Org/SyncStream/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

---

## Features

- Room-based voice communication
- Synchronized media viewing
- Live collaborative document sharing
- Secure file uploads and downloads
- Fully self-hosted for maximum privacy

---

## Installation

### Using Docker 

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/syncstream.git
   cd syncstream
   ```

2. Start the server and client using Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Docker hosts the web client at `http://localhost:80`

---

## Development
To aid in development, clone the repo and follow the guidlines/recommendations laid out in our docs folder. It is easy to get up and running with the server using our docker-compose file and with our client using the the npm scripts available.

Start working on SyncStream locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/syncstream.git
   ```

2. Start the server using the above Installation Docker Compose guidlines.

4. In the `client` directory:
   ```bash
   npm install
   npm run start
   ```

---

## Releases

Client builds are available on the [Releases page](https://github.com/SyncStream-Org/SyncStream/releases). Use the version recommended by your server admin for compatibility.
**We officially support Mac and Windows ONLY. Linux is an experimental build where features are not guranteed to work (though we still provide the builds for you).**

---

## Documentation

All documentation can be found in the [`/docs`](./docs) folder:

- Client <-> Server API
- Release Tagging Method

---

## Badges

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/your-project-id)](https://app.codacy.com/gh/your-org/syncstream/dashboard)

---


## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgements

- Thank you to all open source libraries that make this project possible.

---
