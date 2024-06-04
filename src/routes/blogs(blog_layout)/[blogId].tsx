import { RouteSectionProps } from "@solidjs/router";

export default function BlogView(props: RouteSectionProps) {

    return (
        <div class="">Blog page {props.params.blogId}</div>
    )
}