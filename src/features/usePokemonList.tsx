import { useQuery } from "@apollo/client";
import { useState } from "react";

import {
  Pokemons,
  Pokemons_pokemons_results,
  PokemonsVariables,
} from "../generated/server/Pokemons";
import { POKEMONS } from "../graphql/server/pokemon";

export function usePokemonList(offset: number) {
  const [pokemonData, setPokemonData] = useState<
    Array<Pokemons_pokemons_results | null>
  >([]);

  const { loading, error, data, fetchMore } = useQuery<
    Pokemons,
    PokemonsVariables
  >(POKEMONS, {
    variables: {
      limit: 20,
      offset: offset,
    },
    onCompleted: ({ pokemons }) => {
      setPokemonData((oldData) => [...oldData].concat(pokemons?.results || []));
    },
    fetchPolicy: "cache-first",
  });

  return {
    loading,
    error,
    fetchMore,
    pokemonData,
    data,
  };
}
