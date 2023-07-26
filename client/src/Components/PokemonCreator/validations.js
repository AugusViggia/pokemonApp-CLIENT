function allFieldsValid (input, error) {
    if (!input) {
        return false;
    }

    return (
        input.name.trim().length >= 4 &&
        input.hp >= 1 &&
        input.hp <= 999 &&
        input.attack >= 1 &&
        input.attack <= 999 &&
        input.defense >= 1 &&
        input.defense <= 999 &&
        input.speed >= 1 &&
        input.speed <= 999 &&
        input.height >= 1 &&
        input.height <= 999 &&
        input.weight >= 1 &&
        input.weight <= 999 &&
        input.image.trim() !== "" &&
        input.types.length > 0 &&
        error.name === "" &&
        Object.values(error).every((val) => val === "")
    );
};

export default allFieldsValid;