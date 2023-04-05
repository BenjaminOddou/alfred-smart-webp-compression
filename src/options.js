ObjC.import('stdlib')
const app = Application.currentApplication()
app.includeStandardAdditions = true
const PWD = $.getenv("PWD")
const fm = $.NSFileManager.defaultManager
const encoding = $.NSUTF8StringEncoding
const data_folder = $.NSProcessInfo.processInfo.environment.objectForKey('data_folder')?.js || $.NSProcessInfo.processInfo.environment.objectForKey('alfred_workflow_data').js
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

items.push(
    {
        title: 'Manual options',
        subtitle: 'Run the cwebp compression with your manual input',
        arg: 'manual',
        icon: { path: 'icons/manual.webp' },
    },
)
try {
    content = JSON.parse(readFile(`${data_folder}/presets.json`))
    content.items.forEach(item => { items.push(item) })
} catch {}

JSON.stringify({ items })