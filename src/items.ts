type ItemType = "block" | "item" | "folder";

type Item = {
    type: ItemType;
    name?: string;
    fullName: string; // serves as id
    imageName?: string;
    path: number[];
    children?: Item[];
};

type BrowserState = {
    hidden: Record<string, boolean>;
    showHidden: boolean;
};
