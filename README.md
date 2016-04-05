# hain-plugin-putty
A Hain plugin to launch PuTTY sessions. Currently extremely simplistic.

## Requirements
Current it expects to find the `putty` command to be in your PATH.

## TODO
1. Check for Putty in normal locations if not in PATH.
2. Query stored locations
3. Add support for different protocols (telnet, FTP etc.). Currently uses whatever the default connection is (normally SSH)
