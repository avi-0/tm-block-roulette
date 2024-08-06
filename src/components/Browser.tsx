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

export type BrowserState = {
    hidden: Record<string, boolean>;
    grouped: Record<string, boolean>;
};

export type BrowserParams = {
    onItemClicked?: (item: Item) => void;
    filter?: (item: Item) => boolean;
};

const Row: Component<{
    items: Item[];
    state: BrowserState;
    params: BrowserParams;
}> = (props) => {
    const [expanded, setExpanded] = createSignal<Item | undefined>(undefined);

    createEffect(() => {
        if (props.items) {
            setExpanded(undefined);
        }
    });

    return (
        <div class="flex flex-col items-start gap-3">
            <div class="flex flex-wrap gap-1">
                <For
                    each={props.items.filter(
                        props.params.filter || (() => true),
                    )}
                >
                    {(item, index) => {
                        const hidden = () => props.state.hidden[item.fullName];
                        const grouped = () =>
                            props.state.grouped[item.fullName];

                        const color = () =>
                            hidden()
                                ? "bg-red-300 hover:bg-red-400"
                                : grouped()
                                  ? "bg-cyan-300 hover:bg-cyan-400"
                                  : expanded() == item
                                    ? "bg-yellow-400"
                                    : item.type == "folder"
                                      ? "bg-yellow-200"
                                      : "bg-slate-200";

                        const onClick = () => {
                            if (props.params.onItemClicked != undefined) {
                                props.params.onItemClicked(item);
                            } else if (
                                item.type == "folder" &&
                                item.children != undefined
                            ) {
                                if (item == expanded()) {
                                    setExpanded(undefined);
                                } else {
                                    setExpanded(item);
                                }
                            }
                        };

                        const onMouseOver = () => {
                            if (
                                item.type == "folder" &&
                                item.children != undefined
                            ) {
                                setExpanded(item);
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

            <Show when={expanded() != undefined}>
                <Row
                    items={expanded()!.children || []}
                    state={props.state}
                    params={props.params}
                />
            </Show>
        </div>
    );
};

export const Browser: Component<{
    state: BrowserState;
    params: BrowserParams;
}> = (props) => {
    const [tab, setTab] = createSignal<"blocks" | "items">("blocks");

    const root = () => (tab() == "blocks" ? blocks : items) as Item;

    return (
        <div class="flex w-full flex-1 flex-col justify-stretch gap-1 overflow-auto rounded-md bg-white p-2 shadow-inner transition-all">
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

            <Row
                items={root().children!}
                state={props.state}
                params={props.params}
            />
        </div>
    );
};
