import {useEffect } from "react";

const defaultTitle = "PokéGuesser";

export default function useDocumentTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} | ${defaultTitle}` : defaultTitle;
    }, [title])
}