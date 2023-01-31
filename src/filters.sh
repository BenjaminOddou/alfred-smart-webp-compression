#!/bin/zsh

if [[ $1 = "docs" ]]; then
    raw='{
            "uid":"Online documention",
            "title":"Online documention",
            "subtitle":"Open online cwebp documentation",
            "arg":"online",
            "autocomplete":"Online documention",
            "icon": {
                "path":"globe-icon.png"
            }
        }'
    json=$(jq '.' ./docs.txt) # to refresh with update_doc.alfredworkflow in dist folder
elif [[ ${1%_*} = "presets" ]]; then
    if [[ ${1#*_} = "menu" ]]; then
        raw='{
                "title":"Add a preset",
                "subtitle":"Create a new preset and save it in Alfred app",
                "arg":"new",
                "autocomplete":"Add a preset",
                "icon": {
                    "path":"CE6A52F7-0196-452F-ACAB-DC1A45F35E0B.png"
                }
            }
            {
                "title":"Remove a preset",
                "subtitle":"Select the preset you want to remove and press enter",
                "arg":"delete",
                "autocomplete":"Remove a preset",
                "icon": {
                    "path":"154BFBB1-825A-4E5D-A989-907CC91E90B1.png"
                }
            }
            {
                "title":"Modify a preset",
                "subtitle":"Select the preset you want to modify and change its value",
                "arg":"modify",
                "autocomplete":"Modify a preset",
                "icon": {
                    "path":"D0BCADEA-4B48-4681-BF5A-3A99963BCB69.png"
                }
            }'
    elif [[ ${1#*_} = "options" ]]; then
        raw='{
                "title":"Manual options",
                "subtitle":"Run the cwebp compression with your manual input",
                "arg":"manual",
                "autocomplete":"Manual options",
                "icon": {
                    "path":"36746137-2858-4981-968C-2DDC0B19B7E8.png"
                }
            }'
    else
        raw=""
    fi
    json=$(jq '.' $data_folder/presets.txt)
fi

temp=$(echo "$raw$json")
final=$(jq -s '{items : .}' <<< $temp)

cat << EOB
$final
EOB