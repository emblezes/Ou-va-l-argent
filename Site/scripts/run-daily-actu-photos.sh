#!/bin/zsh
# Wrapper cron — Illustrations d'actu quotidiennes "Où va l'argent"
# Charge les secrets (~/.zshrc) puis lance le pipeline. Logue dans /tmp.
#
# Installation du cron (à lancer UNE fois dans le Terminal) :
#   chmod +x "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site/scripts/run-daily-actu-photos.sh"
#   (crontab -l 2>/dev/null | grep -v daily-actu-photos; \
#     echo '0 7 * * * "/Users/emmanuelblezes/Documents/08_Où va l'\''argent /Site/scripts/run-daily-actu-photos.sh"') | crontab -

source ~/.zshrc 2>/dev/null
cd "/Users/emmanuelblezes/Documents/08_Où va l'argent /Site" || exit 1
/usr/local/bin/node scripts/daily-actu-photos.js "$@" >> /tmp/ovla-daily-photos.log 2>&1
