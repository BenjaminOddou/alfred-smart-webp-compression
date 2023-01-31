#!/bin/zsh

setup_tools=( "brew" "jq" )
webp_v=""
for i in "${setup_tools[@]}"; do
  if [[ "$(command -v $i)" = "" ]]; then 
    webp_v="Cannot check cwebp version -> go to the setup toolbox and check Homebrew and jq installation 🚧"
    break
  fi
done

if [[ "$(command -v cwebp)" != "" ]]; then
  online_version="$(curl -s https://formulae.brew.sh/api/formula/webp.json | jq -r '.versions.stable')"
  local_version="$(cwebp -version | sed -n '1p')"
  if [[ "$online_version" = "$local_version" ]]; then
    webp_v="cwebp is up to date ✅ | $local_version"
  elif [[ "$local_version" != "" ]]; then
    webp_v="Update available ✨ | $local_version to $online_version"
  fi
else
  webp_v="cwebp is not installed ❌ | It needs Homebrew to be installed ⚠️"
fi

cat << EOB
{
"items": [
   {
    "title": "Start the compression",
    "subtitle": "Run the cwebp compression with your parameters",
    "arg": "compress",
    "autocomplete": "Start the compression",
    "icon": {
        "path": "rocket-icon.png"
      }
    },
   {
    "title": "Presets",
    "subtitle": "Create, modify or remove presets",
    "arg": "presets",
    "autocomplete": "Presets",
    "icon": {
        "path": "30F44CB0-C58D-48C6-B23A-AA81E4A3CD16.png"
      }
    },
   {
    "title": "CWebP documentation",
    "subtitle": "Show cwebp documentation",
    "arg": "doc",
    "autocomplete": "CWebP documentation",
    "icon": {
        "path": "CB9B4DE3-0575-43F8-A28E-3B18C623C590.png"
      }
    },
   {
    "title": "CWebP version",
    "subtitle": "$webp_v",
    "arg": "webp",
    "autocomplete": "CWebP version",
    "icon": {
        "path": "webp-icon.png"
      }
    },
    {
    "title": "Setup toolbox",
    "subtitle": "All tools needed for the workflow",
    "arg": "tools",
    "autocomplete": "Setup toolbox",
    "icon": {
        "path": "1F94198E-A0AE-4609-A7AB-18F2EA5BD61E.png"
      }
    }
  ]
}
EOB