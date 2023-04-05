ObjC.import('stdlib')
const app = Application.currentApplication()
app.includeStandardAdditions = true
const PWD = $.getenv("PWD")
const fm = $.NSFileManager.defaultManager
const encoding = $.NSUTF8StringEncoding
const level = $.NSProcessInfo.processInfo.environment.objectForKey('split2')?.js || 0
const type = $.NSProcessInfo.processInfo.environment.objectForKey('split3')?.js || null
const action = $.NSProcessInfo.processInfo.environment.objectForKey('split4')?.js || null
const key = $.NSProcessInfo.processInfo.environment.objectForKey('split5')?.js || null
const data_folder = $.NSProcessInfo.processInfo.environment.objectForKey('data_folder')?.js || $.NSProcessInfo.processInfo.environment.objectForKey('alfred_workflow_data').js
const cmd = "which cwebp";
let items = []

function readFile(path) {
    if (fm.fileExistsAtPath(path)) {
        return $.NSString.stringWithContentsOfFileEncodingError(path, encoding, null).js
    } else {
        const sourcePath = `${PWD}/json/presets.json`
        fm.createDirectoryAtPathWithIntermediateDirectoriesAttributesError(data_folder, true, $(), null)
        fm.copyItemAtPathToPathError(sourcePath, path, null)
        return $.NSString.stringWithContentsOfFileEncodingError(path, encoding, null).js
    }
}

try {
    app.doShellScript(cmd)
    if (level == 0){
        items.push(
            {
                title: 'Start the compression',
                subtitle: 'Run the cwebp compression with your parameters',
                arg: '_compress',
                icon: { path: 'icons/run.webp' },
            },
            {
                title: 'Presets',
                subtitle: 'Create, modify or remove presets',
                arg: '_rerun;1;presets',
                icon: { path: 'icons/presets.webp' },
            },
            {
                title: 'Online documentation',
                subtitle: 'Show cwebp documentation',
                quicklookurl: 'https://developers.google.com/speed/webp/docs/cwebp',
                arg: '_web;https://developers.google.com/speed/webp/docs/cwebp',
                icon: { path: 'icons/web.webp' },
            },
        )
    } else {
        items.push({
            title: 'Return',
            subtitle: 'Back to previous state',
            arg: `_rerun;${level - 1};${type}`,
            icon: { path: 'icons/return.webp' },
        })
        if (level == 1) {
            if (type == 'presets') {
                items.push(
                    {
                        title: 'Add a new preset',
                        subtitle: 'Create a new preset with custom cwebp options',
                        arg: '_presets;new',
                        icon: { path: 'icons/new.webp' },
                    },
                    {
                        title: 'Delete a preset',
                        subtitle: 'Erase a preset from the list below',
                        arg: '_rerun;2;presets;delete',
                        icon: { path: 'icons/delete.webp' },
                    }
                )
                content = JSON.parse(readFile(`${data_folder}/presets.json`))
                content.items.forEach(item => {
                    item.arg = `_rerun;2;presets;modify;${item.id}`
                    items.push(item)
                })
            }
        } else if (level == 2) {
            if (type == 'presets') {
                if (action == 'delete') {
                    content = JSON.parse(readFile(`${data_folder}/presets.json`))
                    content.items.forEach(item => {
                        item.arg = `_presets;delete;${item.id}`
                        items.push(item)
                    })
                } else if (action == 'modify') {
                    content = JSON.parse(readFile(`${data_folder}/presets.json`))
                    content.items.forEach(item => {
                        if (item.id == key) {
                            items.push(
                                {
                                    title: 'Modify the Preset\'s Title/Subtitle',
                                    subtitle: `Current Title: ${item.title} ǀ Current Subtitle: ${item.subtitle}`,
                                    arg: `_presets;modify;tl&sb;Title and/or Subtitle;${item.title}/${item.subtitle};${key}`,
                                    icon: { path: 'icons/presets.webp' },
                                },
                                {
                                    title: 'Modify the Preset\'s Value',
                                    subtitle: `Current Value: ${item.arg}`,
                                    arg: `_presets;modify;arg;Value;${item.arg};${key}`,
                                    icon: { path: 'icons/presets.webp' },
                                }
                            )
                        }
                    })
                }
            }
        }
    }
    JSON.stringify({ items }) 
} catch {
    items = []
    items.push(
        {
            title: 'Something went wrong...',
            subtitle: 'Press ⏎ to check the docs online',
            arg: '_web;https://github.com/BenjaminOddou/alfred-smart-webp-compression',
            quicklookurl: 'https://github.com/BenjaminOddou/alfred-smart-webp-compression',
            icon: { path: 'icons/info.webp' },
        },
    )
    JSON.stringify({ items })
}