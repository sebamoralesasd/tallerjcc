#!/bin/bash

echo "Ejecutando script el día y hora $(date)"

echo "Programa $0 con $# argumentos y pid $$"

for file in "$@"; do
    grep pepe "$file" > /dev/null 

    if [ $? -ne 0 ]; then
        echo "El archivo $file no contiene la palabra pepe, será agregada."
        echo "# pepe" >> "$file"
    fi
done
