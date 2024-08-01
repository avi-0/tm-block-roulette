import fs from 'node:fs/promises';
import JSON5 from 'json5';

console.log("ok")
const blockInfo = JSON5.parse(await fs.readFile("scripts/BlockInfoInventory.gbx.json", "utf8"));
const itemInfo = JSON5.parse(await fs.readFile("scripts/ItemInventory.gbx.json", "utf8"));

function setPaths(info: any, dict: any = {}, prefix = "") {
    const children = info.Childs || info.RootChilds;
    if (typeof children == 'object') {
        children.forEach((child: any, index: number) => {
            setPaths(child, dict, `${prefix} ${index + 1}`);
        });
    } else if (typeof info.Name == 'string') {
        const name = info.Name as string;
        dict[name] = prefix.replace(/^ /, "");
    }

    return dict
}

const paths = setPaths(blockInfo);
setPaths(itemInfo, paths)

fs.writeFile("src/inventory_paths.ts", `// file generated automatically with parseinventory.ts
export const blockPaths: Record<string, string> = ${JSON.stringify(paths, null, 4)};`)