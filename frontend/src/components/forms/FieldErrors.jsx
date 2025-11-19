export default function FieldErrors({errors}) {
    return (
        <div className="field-errors flex-center">
            {errors.map(error => <p className="field-error">{error}</p>)}
        </div>
    );
}