export default function Main({className, children}) {
    return (
        <main>
            <div className={className ? className : "content"}>{children}</div>
        </main>
    );
}