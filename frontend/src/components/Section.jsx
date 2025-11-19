export default function Section({title, children}) {
    return (
        <section className="section-info">
            <h1 className="section-title">{title}</h1>
            {children}
        </section>
    );
}