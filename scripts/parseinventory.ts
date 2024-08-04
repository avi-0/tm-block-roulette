import fs from "node:fs/promises";
import JSON5 from "json5";

const blockInfo = JSON5.parse(
    await fs.readFile("scripts/BlockInfoInventory.gbx.json", "utf8"),
);
const itemInfo = JSON5.parse(
    await fs.readFile("scripts/ItemInventory.gbx.json", "utf8"),
);

function setPaths(info: any, dict: any = {}, prefix = "") {
    const children = info.Childs || info.RootChilds;
    if (typeof children == "object") {
        children.forEach((child: any, index: number) => {
            setPaths(child, dict, `${prefix} ${index + 1}`);
        });
    } else if (typeof info.Name == "string") {
        const name = info.Name as string;
        dict[name] = prefix.replace(/^ /, "");
    }

    return dict;
}

const paths = setPaths(blockInfo);
setPaths(itemInfo, paths);

const imageNames = await fs.readdir("public/images/");
function findImageName(name: string): string | undefined {
    return imageNames.find((imageName) =>
        RegExp("^" + name + "\\.", "i").test(imageName),
    );
}

function parse(
    info: any,
    basePath: number[] = [],
    defaultType: ItemType = "block",
): Item {
    const name = info.Name as string;
    const children = info.Childs || info.RootChilds;
    if (typeof children == "object") {
        const childrenParsed = children.map((child: any, index: number) =>
            parse(child, [...basePath, index + 1]),
        );

        return {
            type: "folder",
            name: name,
            imageName: childrenParsed[0]?.imageName,
            path: basePath,
            children: childrenParsed,
        };
    } else {
        return {
            type: defaultType,
            name: name,
            imageName: findImageName(name),
            path: basePath,
        };
    }
}

const blocks = parse(blockInfo, [], "block");
const items = parse(itemInfo, [], "item");

blocks.children?.pop();

fs.writeFile(
    "src/game_data.ts",
    `// file generated automatically with parseinventory.ts
export const blockPaths: Record<string, string> = ${JSON.stringify(paths)};
`,
);

fs.writeFile("public/blocks.json", JSON.stringify(blocks, null, 4));
fs.writeFile("public/items.json", JSON.stringify(items));
