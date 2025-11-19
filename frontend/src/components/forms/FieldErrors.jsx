export default function FieldErrors({errors}) {
    return (
        <div className="field-errors flex-center">
            {errors.map((error, i) => <p key={`${error}-${i}`}className="field-error">{error}</p>)}
        </div>
    );
}