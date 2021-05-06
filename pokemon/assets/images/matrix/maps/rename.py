#!/usr/bin/env python
import os

# ITW - Introdução às Tecnologias Web 2020/2021
# Grupo n. 10
# Bernardo Rebelo  - 55856 - PL23
# Daniel Barreto   - 34989 - PL23
# Lucas Pinto      - 56926 - PL23


def dealIt(d, frm, to):
    files = os.listdir(d)

    for file in files:
        os.rename(f'{d}/{file}', f'{d}/{file.replace(frm, to)}')

            
if __name__ == '__main__':
    import argparse

    #c
    parser = argparse.ArgumentParser(description='Replace Renames all files in a directory.')
    parser.add_argument('dir', help='Directory path.')
    parser.add_argument('frm', help='From what to replace.')
    parser.add_argument('to', default='map', help='From what to replace.', nargs='?')

    args = parser.parse_args()
    dealIt(args.dir, args.frm, args.to)
