#!/bin/zsh

packages=( "jq" )
c=1
if [[ "$(brew --version | sed 1q | grep -o Homebrew)" = "Homebrew" ]]; then
 brewv="$(brew --version | sed 1q) ✅"
  for i in "${packages[@]}"; do
    if [[ "$(command -v $i)" != "" ]]; then 
      package[c]="$(brew list --versions $i) ✅"
    else
      package[c]="$i is not installed 🚧 | It needs Homebrew to be installed ⚠️"
    fi
    c=$((c + 1))
  done
else
  brewv="Hombrew is not installed 🚧"
fi

cat << EOB
{
"items": [
   {
    "title": "Homebrew",
    "subtitle": "$brewv",
    "arg": "brew",
    "autocomplete": "Homebrew",
    "icon": {
        "path": "homebrew-icon.png"
      }
    },
    {
    "title": "Jq",
    "subtitle": "${package[1]}",
    "arg": "jq",
    "autocomplete": "Jq",
    "icon": {
        "path": "jq-icon.png"
      }
    }
  ]
}
EOB