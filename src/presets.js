ObjC.import('stdlib')
ObjC.import('Cocoa')
const app = Application.currentApplication()
app.includeStandardAdditions = true
const fm = $.NSFileManager.defaultManager
const encoding = $.NSUTF8StringEncoding
const sound = $.NSProcessInfo.processInfo.environment.objectForKey('sound')?.js || 'Submarine'
const data_folder = $.NSProcessInfo.processInfo.environment.objectForKey('data_folder')?.js || $.NSProcessInfo.processInfo.environment.objectForKey('alfred_workflow_data').js
const action = $.NSProcessInfo.processInfo.environment.objectForKey('split2')?.js || ''
let items =[]

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

content = JSON.parse(readFile(`${data_folder}/presets.json`))

try {
    if (action == 'new') {
        const uuid = $.NSUUID.UUID.UUIDString.js
        const _new_preset = $.NSProcessInfo.processInfo.environment.objectForKey('_new_preset')?.js || ''
        const args = $.NSProcessInfo.processInfo.arguments.objectAtIndex(4).js.split('/')
        const title = args[0]?.trim() !== '' ? args[0]?.trim() : 'No title';
        const subtitle = args[1]?.trim() !== '' ? args[1]?.trim() : 'No description';
        items.push(
            {
                title: `${title}`,
                subtitle: `${subtitle}`,
                arg: `${_new_preset}`,
                id: `${uuid}`,
                icon: { path: 'icons/presets.webp' },
            },
        )
        content.items.forEach(item => { items.push(item) })
        app.doShellScript('./notificator --title "✅ Success !" --message "Preset ' + title + ' created" --sound "'+ sound + '"')
    } else if (action == 'delete') {
        const key = $.NSProcessInfo.processInfo.environment.objectForKey('split3')?.js || ''
        content.items.forEach(item => {
            if (item.id != key) {
                items.push(item)
            } else {
                app.doShellScript('./notificator --title "✅ Success !" --message "Preset ' + item.title + ' deleted" --sound "'+ sound + '"')
            }
        })
    } else if (action == 'modify') {
        const type = $.NSProcessInfo.processInfo.environment.objectForKey('modif3')?.js || ''
        const new_value = $.NSProcessInfo.processInfo.arguments.objectAtIndex(4).js
        const key = $.NSProcessInfo.processInfo.environment.objectForKey('modif6')?.js || ''
        if (type == 'tl&sb') {
            const args = new_value.split('/')
            const title = args[0]?.trim() !== '' ? args[0]?.trim() : 'No title';
            const subtitle = args[1]?.trim() !== '' ? args[1]?.trim() : 'No description';
            content.items.forEach(item => {
                if (item.id == key) {
                    item.title = title
                    item.subtitle = subtitle
                    app.doShellScript('./notificator --title "✅ Success !" --message "Preset ' + title + ' modified" --sound "'+ sound + '"')
                }
                items.push(item)
            })
        } else if (type == 'arg') {
            content.items.forEach(item => {
                if (item.id == key) {
                    item.arg = new_value
                    app.doShellScript('./notificator --title "✅ Success !" --message "Preset ' + item.title + ' modified" --sound "'+ sound + '"')
                }
                items.push(item)
            })
        }

    }

    $.NSString.alloc.initWithUTF8String(JSON.stringify({'items': items}, null, 4))
        .writeToFileAtomicallyEncodingError(`${data_folder}/presets.json`, true, encoding, null)
} catch (e) {
    app.doShellScript('./notificator --title "🚨 Error !" --message "' + e + '" --sound "'+ sound + '"')
}