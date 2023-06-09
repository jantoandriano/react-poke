/** @jsxImportSource @emotion/react */

import { css, Theme, useTheme } from "@emotion/react";

import CatchButton from "../../components/CatchButton";
import Error from "../../components/Error";
import LoadingIndicator from "../../components/LoadingIndicator";
import { usePokemonDetail } from "../../features/usePokemonDetail";
import DetailsContent from "./components/DetailsContent";
import DetailsHeader from "./components/DetailsHeader";

type Props = {
  location: {
    state: {
      name: string;
      nickname?: string;
    };
  };
};

export default function Details(props: Props) {
  const styles = useStyles(useTheme());
  const { colors } = useTheme();

  const {
    pokemonData,
    nickname,
    loading,
    error,
    catched,
    onCatchClick,
  } = usePokemonDetail({
    name: props.location.state.name,
    nickName: props.location.state.nickname,
  });

  if (loading) {
    return (
      <LoadingIndicator
        containerStyle={{
          paddingTop: 100,
          height: "100vh",
          backgroundColor: colors.background,
        }}
      />
    );
  }

  if (error) {
    return <Error />;
  }

  return (
    <div css={styles.container}>
      <div css={styles.detailsContainer}>
        <DetailsHeader
          id={pokemonData?.id || 0}
          name={nickname}
          types={pokemonData?.types}
        />
        <DetailsContent pokemonData={pokemonData} />
      </div>
      <CatchButton
        label={catched ? "RELEASE" : "CATCH"}
        onClick={onCatchClick}
      />
    </div>
  );
}

const useStyles = ({ colors }: Theme) => {
  return {
    container: css({
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: colors.background,
    }),
    detailsContainer: css({
      display: "flex",
      marginBottom: "5rem",
      "@media screen and (max-width: 960px)": {
        flexDirection: "column",
        marginBottom: 0,
      },
    }),
  };
};
