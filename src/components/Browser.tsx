import {
    Component,
    createEffect,
    createResource,
    createSignal,
    For,
    Show,
} from "solid-js";

import blocks from "../../public/blocks.json";

const Item: Component<{
    item?: Item;
}> = (props) => {
    const [expanded, setExpand] = createSignal(false);

    const color = () =>
        expanded()
            ? "bg-yellow-400"
            : props.item?.type == "folder"
              ? "bg-yellow-200"
              : "bg-slate-100";

    return (
        <div class="flex flex-col items-start gap-1 transition-all">
            <img
                class={`w-18 rounded-md ${color()} p-1 shadow-md transition-all hover:shadow-lg`}
                src={`${import.meta.env.SERVER_BASE_URL}/images/${props.item?.imageName}`}
                onClick={() => setExpand((value) => !value)}
            />
            <div class="select-none text-center text-xs">
                {props.item?.name}
            </div>

            <Show when={expanded()}>
                <div class="flex flex-col pl-4">
                    <For each={props.item?.children}>
                        {(item) => <Item item={item} />}
                    </For>
                </div>
            </Show>
        </div>
    );
};

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
                                src={`${import.meta.env.SERVER_BASE_URL}/images/${item.imageName}`}
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
    // const [blocks] = createResource<Item>(async () => {
    //     return await (await import("../../blocks.json")).json();
    // });

    return (
        <div class="flex w-full flex-col justify-stretch overflow-auto rounded-md bg-white p-2 shadow-inner transition-all">
            <Row items={(blocks as Item).children!} />
        </div>
    );
}
