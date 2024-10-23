#!/bin/bash

# Sincroniza subs de la cuarta de Atlanta con ffs.
# ./subs.sh DESDE HASTA
# DESDE=1 HASTA=10 por default
for i in $(seq "${1:-1}" "${2:-10}"); 
do 
  ffs "Atlanta S04E0${i}.mp4" -i "$i.srt" \
    -o "Atlanta S04E0${i}.srt"; 
done
