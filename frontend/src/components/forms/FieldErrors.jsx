export default function FieldErrors({errors}) {
    return (
        <>
            {errors.map(error => <p className="field-error">{error}</p>)}
        </>
    );
}