export default function Main({className, children, mainClass}) {
    return (
        <main className={mainClass ? mainClass : null}>
            <div className={className ? className : "content"}>{children}</div>
        </main>
    );
}