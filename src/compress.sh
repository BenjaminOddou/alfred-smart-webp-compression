#!/bin/zsh

function handle_error {
  source ./notificator --title "🚨 Error" --message "An error occurred! Exiting script.." --sound "$sound"
  exit 1
}

trap "handle_error" ERR

(source ./notificator --title "⏳ Please wait..." --message "The workflow is generating images" --sound "$sound") &

echo "🔍 Depth of the search : Level ${level}\n"

LINKS=(${(s/	/)_links_list}) # split by tab
IMAGES=()
IFS=$'\n'

for LINK in "${LINKS[@]}"; do
  if [ -d "$LINK" ]; then
    IMAGES+=($(find -E "$LINK" -maxdepth "$level" -iregex '.*\.(png|jpg|jpeg|tif|tiff|webp)'))
  else
    IMAGES+=("$LINK")
  fi
done

for IMAGE in "${IMAGES[@]}"; do
  2>&1 eval "cwebp $_the_preset \"$IMAGE\" -o \"${IMAGE%.*}.webp\""
done

if [[ $workflow_action = "_notif" ]];then
  sleep 0.5
  source ./notificator --title "⌛ Finished" --message "Process completed. You can check the log file" --sound "$sound"
fi