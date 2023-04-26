import { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db";

export function usePokemonGacha() {
  const [pokemonDb, setPokemonDb] = useState();
  const { getAll } = useIndexedDB("pokemons");

  useEffect(() => {
    getAll().then(
      (
        db: Array<{ id: number; name: string; nickname: string; image: string }>
      ) => {
        const map: any = {};

        db.forEach((item) => {
          if (!map[item.name]) {
            map[item.name] = 1;
          } else {
            map[item.name] += 1;
          }
        });
        setPokemonDb(map);
      }
    );
  }, []);

  return {
    pokemonDb,
  };
}
