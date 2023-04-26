import { useQuery } from "@apollo/client";
import { useState } from "react";
import { useIndexedDB } from "react-indexed-db";
import { useHistory } from "react-router-dom";

import {
  Pokemon,
  Pokemon_pokemon,
  PokemonVariables,
} from "../generated/server/Pokemon";
import { POKEMON } from "../graphql/server/pokemon";

export function usePokemonDetail(params: { name: string; nickName?: string }) {
  const { name, nickName } = params;
  const { deleteRecord, getByIndex } = useIndexedDB("pokemons");
  const history = useHistory();

  const [pokemonData, setPokemonData] = useState<Pokemon_pokemon>();
  const [nickname, setNickname] = useState("");

  const [catched, setCatched] = useState<{
    id: number;
    name: string;
    nickname: string;
  } | null>(null);

  const { loading, error } = useQuery<Pokemon, PokemonVariables>(POKEMON, {
    variables: {
      name,
    },
    onCompleted: async ({ pokemon }) => {
      if (pokemon) {
        setPokemonData(pokemon);
        setNickname(nickName || pokemon.name || "");

        const catchedPokemon = await getByIndex(
          "nickname",
          nickName || pokemon.name
        );

        if (catchedPokemon) {
          setCatched(catchedPokemon);
        }
      }
    },
    fetchPolicy: "cache-first",
  });

  const onCatchClick = () => {
    if (catched) {
      deleteRecord(catched.id).then(
        () => {
          console.log("successfully released the pokemon");
        },
        (error) => {
          console.log(error);
        }
      );
      history.push({
        pathname: "/catching-pokemon",
        state: {
          release: true,
        },
      });
    } else {
      history.push({
        pathname: "/catching-pokemon",
        state: {
          name: pokemonData?.name,
          nickname: nickname,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData?.id}.png`,
        },
      });
    }
  };

  return {
    deleteRecord,
    pokemonData,
    nickname,
    loading,
    error,
    onCatchClick,
    catched,
  };
}
