import { ParentComponent } from "solid-js";

export const Button: ParentComponent<{
    filled?: boolean;
    onClick?: () => void;
}> = (props) => {
    return (
        <button
            class={`rounded-md border border-sky-500 ${props.filled ? "bg-sky-500 text-white" : "bg-transparent text-sky-500"} px-2 shadow-sm transition-all hover:border-sky-600 hover:bg-sky-600 hover:text-white`}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
};
