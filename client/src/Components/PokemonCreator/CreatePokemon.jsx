import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import PokemonForm from "./PokemonForm";
import { getPokemons } from "../../Redux/Actions/Actions-Functions/actions-pokemons";
import allFieldsValid from "./validations";
import axios from "axios";
import FormFeedbackModal from "./FormFeedbackModal";

const initialInput = {
  name: "", image: "", shinyImage: "", hp: 0, height: 0, weight: 0,
  attack: 0, defense: 0, speed: 0, types: [],
};

const initialError = {
  name: "", image: "", hp: "", height: "", weight: "",
  attack: "", defense: "", speed: "", types: "",
};

const CreatePokemon = () => {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [input, setInput] = useState(initialInput);
  const [error, setError] = useState(initialError);
  const [formKey, setFormKey] = useState(0);
  const [formRefreshing, setFormRefreshing] = useState(false);

  const types = useSelector((state) => state.types);
  const dispatch = useDispatch();

  const resetForm = () => {
    setInput(initialInput);
    setError(initialError);
    setSelectedTypes([]);
    setFormKey((key) => key + 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheck = (event) => {
    const selectedType = String(event.target.value);
    const checked = event.target.checked;
    const nextTypes = checked
      ? [...selectedTypes.filter((type) => String(type) !== selectedType), selectedType].slice(-2)
      : selectedTypes.filter((type) => String(type) !== selectedType);

    setSelectedTypes(nextTypes);
    setInput((prev) => ({ ...prev, types: nextTypes }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!allFieldsValid(input, error)) {
      setFeedbackError("Check that the name has 4-30 characters, choose at least one type, upload a JPG/JPEG image, and complete all stats between 1 and 999.");
      return;
    }

    try {
      const response = await axios.get("/pokemon", {
        params: { page: 1, limit: 1, name: input.name },
      });
      if ((response.data.pagination?.total || response.data.data?.length || 0) > 0) {
        setFeedbackError(`Pokemon ${input.name} already exists.`);
        return;
      }

      await axios.post(`/pokemon/post`, input);
      setSuccessMessage(`${input.name} was created successfully.`);
    } catch (err) {
      console.error(err);
      const responseData = err.response?.data;
      const details = responseData?.details?.join("; ");
      setFeedbackError(details || responseData?.error || err.message || "Creation error.");
    }
  };

  const handleSuccessConfirm = async () => {
    setSuccessMessage("");
    resetForm();
    setFormRefreshing(true);

    try {
      const minimumLoadingTime = new Promise((resolve) => setTimeout(resolve, 1200));
      await Promise.all([
        dispatch(getPokemons({ page: 1, silent: true, force: true })),
        minimumLoadingTime,
      ]);
    } catch (err) {
      setFeedbackError(
        "The Pokémon was created, but the Pokédex could not be refreshed. Return to the Pokédex to try again."
      );
    } finally {
      setFormRefreshing(false);
    }
  };

  return (
    <>
      <PokemonForm
        key={formKey}
        onSubmit={handleSubmit}
        onChange={handleChange}
        input={input}
        error={error}
        types={types}
        selectedTypes={selectedTypes}
        onCheck={handleCheck}
        isRefreshing={formRefreshing}
      />

      {successMessage && (
        <FormFeedbackModal
          title="Pokemon created"
          message={successMessage}
          onConfirm={handleSuccessConfirm}
        />
      )}

      {feedbackError && (
        <FormFeedbackModal
          title="Could not create Pokémon"
          message={feedbackError}
          error
          onConfirm={() => setFeedbackError("")}
        />
      )}
    </>
  );
};

export default CreatePokemon;
