#!/bin/zsh

emojis=( "0️⃣" "1️⃣" "2️⃣" "3️⃣" "4️⃣" "5️⃣" "6️⃣" "7️⃣" "8️⃣" "9️⃣" "🔟" )
echo "🔍 Depth of the search : Level ${emojis[$level]}\n"

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