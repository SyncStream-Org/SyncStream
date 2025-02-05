# Tagging
In this Github repository, tags take the 4 forms described below, where X is the versioning numbers:
 - vX.X: Normal version - Used for major releases
 - vX.X-devtag: Development version - Used for major development builds, devtag can be any descriptive tag or just dev
 - vX.X.X: Hot fix version - Used when making hot fix for version vX.X
 - vX.X.X-devtag: Development small version - Used for development builds contains small updates, devtag can be any descriptive tag or jsut dev

When any tag with this syntax is pushed to the repository, Github workflows will build both a new server container image and push to the organization container repository under the tag as well as build out the client app for Linux, Windows, and Mac in installer and portable versions. The container image will also be tagged as development or latest depending on if it has a devtag or not. Only the newest tag in each category are given this tag.
