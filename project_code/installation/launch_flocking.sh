#!/bin/bash

export appid=ekcijagdlnfjbahhkonfppdninhgnldn  # bottom screen - flocking 2
export appid2=nfeolennnopcblpledhldidannjnfege # top screen - flocking 1
export appid3=hfolaojiklihmhapliohdbohpbfhccgn # flocking server 

sleep 11 && /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/Users/wishingwall2/chrome1 --app-id=$appid2 &
sleep 13 && /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/Users/wishingwall2/chrome2 --app-id=$appid  &
sleep 10 && /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/Users/wishingwall2/chrome4 --app-id=$appid3 &

