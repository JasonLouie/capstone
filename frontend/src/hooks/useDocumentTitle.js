import {useEffect } from "react";

const defaultTitle = "PokéGuesser";

export function useDocumentTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} | ${defaultTitle}` : defaultTitle;
    }, [title]);
}