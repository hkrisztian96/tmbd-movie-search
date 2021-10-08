import "../scss/drawer.scoped.scss";

import { Box, Divider, Drawer, List, ListItem, ListItemText } from "@material-ui/core";
import DOMPurify from "dompurify";
import { observer } from "mobx-react-lite";
import React from "react";
import { useInjected } from "..";
import { SearchState } from "../enums/SearchState";

export const MovieDetailPanel = observer(() => {
  const { movieStore } = useInjected();
  const { panelOpen, searchState, imdbUrl, wikipediaUrl, wikipediaParagraph } = movieStore;

  const toggleDrawer = (open: boolean) =>
  (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
      (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      movieStore.panelOpen = open;
    };

  function onClickWikipedia() {
    window.open(wikipediaUrl, "_blank");
  }

  function onClickIMDB() {
    window.open(imdbUrl, "_blank");
  }

  function onClickRelated(event: React.MouseEvent) {
    movieStore.searchState = SearchState.RELATED;
    toggleDrawer(false)(event);
  }

  return (
    <React.Fragment key="right">
      <Drawer
        anchor="right"
        open={panelOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
        >
          <List>
            <ListItem button={true} onClick={onClickWikipedia} disabled={!wikipediaUrl}>
              <ListItemText primary="Wikipedia"/>
            </ListItem>
            <ListItem button={true} onClick={onClickIMDB} disabled={!imdbUrl}>
              <ListItemText primary="IMDB"/>
            </ListItem>
            {searchState === SearchState.BASIC &&
              <ListItem button={true} onClick={onClickRelated}>
                <ListItemText primary="Related Movies"/>
              </ListItem>
            }
          </List>
          <Divider />
          <List>
            <ListItem button={false}>
              <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(
                wikipediaParagraph ? wikipediaParagraph : "No Wikipedia data found :("
              )}}/>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </React.Fragment>
  );
});