import { A } from "@solidjs/router";
import {
    Component,
    createMemo,
    createResource,
    createSignal,
    For,
    Suspense,
} from "solid-js";
import Counter from "~/components/Counter";
import { imageList } from "~/images";
import { blockPaths } from "~/game_data";
import Browser from "~/components/Browser";

function getPath(imageName: string): string {
    return blockPaths[imageName.replace(/(\.EDClassic|\.Item)\.webp$/, "")];
}

const BlockImage: Component<{
    image: string;
    label?: string;
}> = (props) => {
    return (
        <Suspense>
            <div class="w-18 flex flex-col items-center gap-1 transition-all hover:-translate-y-1">
                <img
                    class="rounded-md bg-white p-1 shadow-md transition-all hover:shadow-lg"
                    src={`${process.env.BASE_PATH}/images/${props.image}`}
                />
                <div class="select-none text-center text-xs">{props.label}</div>
            </div>
        </Suspense>
    );
};

export default function Home() {
    // const [number, setNumber] = createSignal(64);

    // const [list, setList] = createSignal<string[]>([]);

    // const generate = () => {
    //     setList(
    //         Array.from({ length: number() }, () => {
    //             return imageList[Math.floor(Math.random() * imageList.length)];
    //         }).toSorted(),
    //     );
    // };

    return (
        <div class="flex h-screen justify-center gap-2 overflow-auto bg-slate-200 p-4 text-black">
            <div class="flex max-w-screen-md flex-1 flex-col items-center gap-2 overflow-auto">
                <h1 class="text-center text-lg font-bold">
                    Trackmania Block Tool
                </h1>

                <Browser />

                {/* <div class="flex gap-2">
                    <input
                        class="rounded-md bg-white p-2 shadow-md"
                        type="number"
                        min="0"
                        value={number()}
                        onChange={(e) => setNumber(Number(e.target.value))}
                    />
                    <button
                        class="rounded-md bg-blue-500 p-2 text-white shadow-md hover:bg-blue-600"
                        onClick={generate}
                    >
                        Generate
                    </button>
                </div>

                <div class="flex max-w-screen-md flex-wrap justify-center gap-2">
                    <For each={list()}>
                        {(item, index) => (
                            <BlockImage image={item} label={getPath(item)} />
                        )}
                    </For>
                </div> */}
            </div>
        </div>
    );
}
