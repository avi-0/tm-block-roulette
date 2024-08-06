import { BsBox, BsDice3, BsEye, BsX } from "solid-icons/bs";
import { Component, createSignal, Match, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { Browser, BrowserState } from "~/components/Browser";
import { Button } from "~/components/Button";
import { IconButton } from "~/components/IconButton";
import BLOCKS from "../../public/blocks.json";
import ITEMS from "../../public/items.json";

function* getLeaves(
    item: Item,
    grouped?: Record<string, boolean>,
): Generator<Item> {
    if (item.type != "folder" || grouped?.[item.fullName]) {
        yield item;
    } else if (item.children) {
        for (let child of item.children) {
            yield* getLeaves(child, grouped);
        }
    }
}

function contains(item: Item, cond: (item: Item) => boolean): boolean {
    for (let leaf of getLeaves(item)) {
        if (cond(leaf)) {
            return true;
        }
    }

    return false;
}

function isHidden(item: Item, hidden: Record<string, boolean>): boolean {
    for (let path in hidden) {
        if (hidden[path]) {
            if (item.fullName.startsWith(path)) {
                return true;
            }
        }
    }

    return false;
}

const Randomizer: Component<{
    state: BrowserState;
    onRandomized: (items: Item[]) => void;
}> = (props) => {
    const [number, setNumber] = createSignal(0);

    const onSubmit = (e: Event) => {
        e.preventDefault();

        let items: Item[] = [];
        for (let item of getLeaves(BLOCKS as Item, props.state.grouped)) {
            items.push(item);
        }
        for (let item of getLeaves(ITEMS as Item, props.state.grouped)) {
            items.push(item);
        }

        items = items.filter((item) => !isHidden(item, props.state.hidden));
        console.log(items);

        const selectedItems: Item[] = [];
        for (let i = 0; i < number(); i++) {
            if (items.length < 1) {
                break;
            }

            const randomIndex = Math.floor(Math.random() * items.length);
            const [item] = items.splice(randomIndex, 1);
            for (let child of getLeaves(item)) {
                selectedItems.push(child);
            }
        }

        props.onRandomized(selectedItems);
    };

    return (
        <form class="flex flex-col gap-1" onSubmit={onSubmit}>
            <label class="text-sm text-slate-500">
                <p class="pb-1">Number of blocks</p>
                <input
                    class="rounded-md p-1 text-black shadow-inner"
                    type="number"
                    min={0}
                    value={number()}
                    onChange={(e) => setNumber(e.target.valueAsNumber)}
                ></input>
            </label>
            <Button filled={true}>Generate</Button>
        </form>
    );
};

export default function Home() {
    const [tool, setTool] = createSignal<
        "view" | "hide" | "randomizer" | "group"
    >("view");

    const [store, setStore] = createStore<BrowserState>({
        hidden: {},
        grouped: {},
    });

    const [randomizerSelected, setRandomizerSelected] = createSignal<Item[]>(
        [],
    );
    const onRandomized = (items: Item[]) => {
        console.log(items);
        setRandomizerSelected(items);
    };

    const params = () => {
        if (tool() == "randomizer") {
            return {
                onItemClicked: undefined,
                filter: (item: Item) =>
                    contains(item, (child) =>
                        randomizerSelected().includes(child),
                    ),
            };
        } else if (tool() == "hide") {
            return {
                onItemClicked: (item: Item) => {
                    setStore(
                        "hidden",
                        item.fullName,
                        !store.hidden[item.fullName],
                    );
                },
                filter: undefined,
            };
        } else if (tool() == "group") {
            return {
                onItemClicked: (item: Item) => {
                    setStore(
                        "grouped",
                        item.fullName,
                        !store.grouped[item.fullName],
                    );
                },
                filter: undefined,
            };
        } else {
            return {
                onItemClicked: undefined,
                filter: (item: Item) => !store.hidden[item.fullName],
            };
        }
    };

    return (
        <div class="flex h-screen justify-center gap-2 overflow-auto bg-slate-200 p-4 text-black">
            <div class="flex max-w-screen-lg flex-1 flex-col items-center gap-2 overflow-auto">
                <h1 class="text-center text-lg font-bold">
                    Trackmania Block Tool
                </h1>

                <div class="flex gap-2 self-stretch">
                    <Browser state={store} params={params()} />

                    <Switch>
                        <Match when={tool() == "randomizer"}>
                            <Randomizer
                                state={store}
                                onRandomized={onRandomized}
                            />
                        </Match>
                    </Switch>

                    <div class="flex flex-col items-stretch gap-1">
                        <IconButton
                            filled={tool() == "view"}
                            onClick={() => setTool("view")}
                            icon={<BsEye />}
                        >
                            View
                        </IconButton>

                        <IconButton
                            filled={tool() == "randomizer"}
                            onClick={() => setTool("randomizer")}
                            icon={<BsDice3 />}
                        >
                            Randomizer
                        </IconButton>

                        <hr class="divide-y-2 self-stretch border-slate-400" />
                        <div class="self-center text-sm text-slate-500">
                            Tools
                        </div>

                        <IconButton
                            filled={tool() == "hide"}
                            onClick={() => setTool("hide")}
                            icon={<BsX />}
                        >
                            Hide
                        </IconButton>

                        <IconButton
                            filled={tool() == "group"}
                            onClick={() => setTool("group")}
                            icon={<BsBox />}
                        >
                            Group
                        </IconButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
