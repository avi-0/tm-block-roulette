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

const BlockImage: Component<{
  image: string;
}> = (props) => {
  return (
    <Suspense>
      <img
        class="bg-white rounded-md shadow-md size-16 p-1 box-content"
        src={`/tm-block-roulette/images/${props.image}`}
      />
    </Suspense>
  );
};

export default function Home() {
  const [number, setNumber] = createSignal(64);

  const [list, setList] = createSignal<string[]>([]);

  const generate = () => {
    setList(
      Array.from({ length: number() }, () => {
        return imageList[Math.floor(Math.random() * imageList.length)];
      }).toSorted()
    );
  };

  return (
    <div class="bg-slate-100 h-screen p-4 flex flex-col items-center gap-2 overflow-auto">
      <h1 class="font-bold text-lg text-center">Trackmania Block Roulette</h1>

      <div class="flex gap-2">
        <input
          class="bg-white rounded-md p-2 shadow-md"
          type="number"
          min="0"
          value={number()}
          onChange={(e) => setNumber(Number(e.target.value))}
        />
        <button
          class="bg-blue-500 hover:bg-blue-600 text-white rounded-md p-2 shadow-md"
          onClick={generate}
        >
          Generate
        </button>
      </div>

      <div class="max-w-screen-sm flex flex-wrap gap-2 justify-center">
        <For each={list()}>{(item, index) => <BlockImage image={item} />}</For>
      </div>
    </div>
  );
}
