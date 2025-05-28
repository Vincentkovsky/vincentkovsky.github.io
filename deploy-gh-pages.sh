#!/bin/bash
npm run build && cp client/404.html dist/ && npm run deploy:gh-pages
