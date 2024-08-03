type ItemType = "block" | "item" | "folder";

type Item = {
    type: ItemType,
    name?: string,
    imageName?: string,
    path: number[],
    children?: Item[],
}