export default function ColorSelect({defaultColor}) {
    return (
        <div className="flex flex-row gap-5 items-center">
            <input
                name="color"
                defaultValue={defaultColor}
                className="w-20 h-10"
                type="color"
                onChange={(e) => {
                    document.getElementById("colorLabel").innerHTML =
                        e.target.value;
                }}
            />
            <p id="colorLabel">{defaultColor}</p>
        </div>
    )
}