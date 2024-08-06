import { BsDice3, BsEye, BsX } from "solid-icons/bs";
import { createSignal, Match, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { Browser, BrowserState } from "~/components/Browser";
import { Button } from "~/components/Button";
import { IconButton } from "~/components/IconButton";

const RandomizerOptions = () => {
    const [number, setNumber] = createSignal(0);

    return (
        <form class="flex flex-col gap-1">
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
    const [tool, setTool] = createSignal<"view" | "hide" | "randomizer">(
        "view",
    );

    const [store, setStore] = createStore<BrowserState>({
        hidden: {},
    });

    const params = () => {
        if (tool() == "view") {
            return {
                onItemClicked: undefined,
                filter: (item: Item) => !store.hidden[item.fullName],
            };
        } else if (tool() == "randomizer") {
            return {
                onItemClicked: undefined,
                filter: undefined,
            };
        } else {
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
                            <RandomizerOptions />
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
                    </div>
                </div>
            </div>
        </div>
    );
}
