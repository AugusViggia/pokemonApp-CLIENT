import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PokemonForm from "./PokemonForm";
import { getTypes } from "../../Redux/Actions/Actions-Functions/actions-pokemonTypes";
import allFieldsValid from "./validations";
import axios from "axios";

axios.defaults.baseURL = "https://pokemonapp-api-production.up.railway.app";

const CreatePokemon = () => {
    const [selectedTypes, setSelectedTypes] = useState([]);

    const types = useSelector((state) => state.types);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTypes());
    }, [dispatch]);

    const [input, setInput] = useState({
        name: "",
        image: "",
        hp: 0,
        height: 0,
        weight: 0,
        attack: 0,
        defense: 0,
        speed: 0,
        types: [],
    });

    const [error, setError] = useState({
        name: "",
        image: "",
        hp: "",
        height: "",
        weight: "",
        attack: "",
        defense: "",
        speed: "",
        types: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInput((prevInput) => ({
            ...prevInput,
            [name]: value,
        }));
    };

    const handleCheck = (event) => {
        const selectedType = parseInt(event.target.value);
        const checked = event.target.checked;

        if (checked && selectedTypes.length < 2) {
            setSelectedTypes((prevSelectedTypes) => [...prevSelectedTypes, selectedType]);
        } else if (!checked && selectedTypes.includes(selectedType)) {
            setSelectedTypes((prevSelectedTypes) =>
                prevSelectedTypes.filter((type) => type !== selectedType)
            );
        }

        setInput((prevInput) => ({
            ...prevInput,
            types: checked ? [...prevInput.types, selectedType] : prevInput.types.filter((type) => type !== selectedType),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (allFieldsValid(input, error)) {
            try {
                const response = await axios.get(
                  `${axios.defaults.baseURL}/pokemon?name=${input.name}`
                );
                if (response.data.length > 0) {
                    alert(`Pokemon ${input.name} already exists.`);
                    return;
                };
            } catch (error) {
                console.error(error);
                alert(`Verification error: ${error.message}`);
                return;
            };

            try {
                await axios.post(
                  `${axios.defaults.baseURL}/pokemon/post`,
                  input
                );
                alert("Pokemon was creaated.");
                navigate("/home")
            } catch (error) {
                console.error(error);
                alert(`Creation error: ${error.message}`);
            };
        } else {
            alert("Select at least one type.");
        }

        setInput({
            name: "",
            image: "",
            hp: 0,
            height: 0,
            weight: 0,
            attack: 0,
            defense: 0,
            speed: 0,
            types: [],
        });
    };

    return (
        <PokemonForm
            onSubmit={handleSubmit}
            onChange={handleChange}
            input={input}
            error={error}
            types={types}
            selectedTypes={selectedTypes}
            onCheck={handleCheck}
        />
    );
};

export default CreatePokemon;