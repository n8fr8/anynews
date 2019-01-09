#!/bin/sh
curl $1 | grep -E "http.*\.jpg" | sed "s/.*\(http.*\.jpg\).*/\1/" | xargs wget
