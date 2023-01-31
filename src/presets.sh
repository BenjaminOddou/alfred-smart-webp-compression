#!/bin/zsh

if [[ $1 = "new" ]];then
    jq -R 'split(",") | {title: .[0], subtitle: .[1], arg: (.[0] + "," + .[1]), autocomplete: .[0], icon:{path:"preset-icon.png"}}' <<< $2
elif [[ $1 = "delete" ]]; then
    raw=$(jq --arg key "$2" 'del(select(.arg == $key))' "$data_folder/presets.txt")
    final=$(echo $raw | sed 's/null//')
    jq '.' <<< $final
elif [[ $1 = "modify" ]]; then
    new_preset=$(jq -R 'split(",") | {title: .[0], subtitle: .[1], arg: (.[0] + "," + .[1]), autocomplete: .[0], icon:{path:"preset-icon.png"}}' <<< $2)
    jq --arg key1 "$_old_preset" --argjson key2 "$new_preset" 'select(.arg == $key1) |= $key2' "$data_folder/presets.txt"
fi