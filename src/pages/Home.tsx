/** @jsxImportSource @emotion/react */

import { css, Theme, useTheme } from "@emotion/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "../components/Button";
import Card from "../components/Card";
import Error from "../components/Error";
import LoadingIndicator from "../components/LoadingIndicator";
import { usePokemonGacha } from "../features/usePokemonGacha";
import { usePokemonList } from "../features/usePokemonList";

export default function Home() {
  const styles = useStyles(useTheme());
  const theme = useTheme();
  const history = useHistory();

  const [offset, setOffset] = useState(0);
  const { loading, pokemonData, data, error, fetchMore } = usePokemonList(
    offset
  );
  const { pokemonDb } = usePokemonGacha();

  const onClickLoadMore = () => {
    fetchMore({
      variables: {
        limit: 20,
        offset: offset + 20,
      },
    });
    setOffset(offset + 20);
  };

  const onClickPokemonDetail = (name: string) => {
    history.push({
      pathname: "/pokemon-details",
      state: {
        name,
      },
    });
  };

  if (loading && pokemonData.length === 0) {
    return (
      <LoadingIndicator
        containerStyle={{
          paddingTop: 100,
          height: "100vh",
          backgroundColor: theme.colors.background,
        }}
      />
    );
  }

  if (error) {
    return (
      <Error
        containerStyle={{
          paddingTop: 100,
          height: "100vh",
          backgroundColor: theme.colors.background,
        }}
      />
    );
  }

  return (
    <div css={styles.container}>
      <div css={styles.contentContainer}>
        {pokemonData.map((item) => (
          <div css={styles.cardContainer} key={item?.id}>
            <Card
              name={item?.name || ""}
              imgUrl={item?.image || ""}
              pokemonOwned={pokemonDb?.[item?.name || ""] || 0}
              onClick={() => onClickPokemonDetail(item?.name as string)}
            />
          </div>
        ))}
      </div>
      {loading && pokemonData.length >= 0 ? (
        <LoadingIndicator containerStyle={{ marginTop: 20 }} />
      ) : pokemonData.length !== data?.pokemons?.count ? (
        <Button label="Load more" onClick={onClickLoadMore} />
      ) : null}
    </div>
  );
}

const useStyles = ({ colors, spacing }: Theme) => {
  return {
    container: css({
      height: "100%",
      backgroundColor: colors.background,
    }),
    contentContainer: css({
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
    }),
    cardContainer: css({
      margin: spacing.l,
      "@media screen and (max-width: 960px)": {
        margin: spacing.xs,
      },
    }),
  };
};
