import { ParentComponent } from "solid-js";
import { Button } from "./Button";
import { JSX } from "solid-js/jsx-runtime";

export const IconButton: ParentComponent<{
    filled?: boolean;
    onClick?: () => void;
    icon: JSX.Element;
}> = (props) => {
    return (
        <Button filled={props.filled} onClick={props.onClick}>
            <div class="flex items-center gap-1">
                {props.icon}
                {props.children}
            </div>
        </Button>
    );
};
