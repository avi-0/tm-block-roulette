import {
    Component,
    createEffect,
    createResource,
    createSignal,
    For,
    Show,
} from "solid-js";

import blocks from "../../public/blocks.json";
import items from "../../public/items.json";
import { Button } from "./Button";

const Row: Component<{
    items: Item[];
}> = (props) => {
    const [expanded, setExpanded] = createSignal<number | undefined>(undefined);

    createEffect(() => {
        if (props.items) {
            setExpanded(undefined);
        }
    });

    return (
        <div class="flex flex-col items-start gap-1">
            <div class="flex gap-1">
                <For each={props.items}>
                    {(item, index) => {
                        const color = () =>
                            expanded() == index()
                                ? "bg-yellow-400"
                                : item.type == "folder"
                                  ? "bg-yellow-200"
                                  : "bg-slate-200";

                        const onClick = () => {
                            if (
                                item.type == "folder" &&
                                item.children != undefined
                            ) {
                                if (index() == expanded()) {
                                    setExpanded(undefined);
                                } else {
                                    setExpanded(index());
                                }
                            }
                        };

                        const onMouseOver = () => {
                            if (
                                item.type == "folder" &&
                                item.children != undefined
                            ) {
                                setExpanded(index());
                            }
                        };

                        return (
                            <img
                                class={`size-[64px] rounded-md ${color()} p-1 shadow-sm transition-all hover:shadow-md`}
                                src={`${import.meta.env.SERVER_BASE_URL}images/${item.imageName}`}
                                onClick={onClick}
                                onMouseOver={onMouseOver}
                            />
                        );
                    }}
                </For>
            </div>

            <Show
                when={
                    expanded() != undefined &&
                    props.items[expanded()!] != undefined
                }
            >
                <Row items={props.items[expanded()!].children || []} />
            </Show>
        </div>
    );
};

export default function Browser() {
    const [tab, setTab] = createSignal<"blocks" | "items">("blocks");

    const root = () => (tab() == "blocks" ? blocks : items) as Item;

    return (
        <div class="flex w-full flex-col justify-stretch gap-1 overflow-auto rounded-md bg-white p-2 shadow-inner transition-all">
            <div class="flex gap-1">
                <Button
                    filled={tab() == "blocks"}
                    onClick={() => setTab("blocks")}
                >
                    Blocks
                </Button>
                <Button
                    filled={tab() == "items"}
                    onClick={() => setTab("items")}
                >
                    Items
                </Button>
            </div>

            <Row items={root().children!} />
        </div>
    );
}
