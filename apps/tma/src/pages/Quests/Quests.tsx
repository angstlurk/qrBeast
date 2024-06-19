import { List, ListItem } from "konsta/react";
import { Link } from "react-router-dom";
import { questList } from "./questList";

const Quests = () => {
  return (
    <List
      strongIos
      outlineIos
      className="bg-gray-600"
      colors={{
        outlineMaterial: "",
        outlineIos: "",
        strongBgIos: "",
        strongBgMaterial: "",
      }}
    >
      {questList.map(({ to, title, text, media }) => (
        <Link to={to}>
          <ListItem
            colors={{
              groupTitleBgIos: "",
              primaryTextIos: "",
              primaryTextMaterial: "",
              secondaryTextIos: "",
              secondaryTextMaterial: "",
              activeBgIos: "",
              activeBgMaterial: "",
              groupTitleBgMaterial: "",
              menuListItemTextIos: "",
              menuListItemTextMaterial: "",
              menuListItemBgIos: "",
              menuListItemBgMaterial: "",
              menuListItemActiveTextIos: "",
              menuListItemActiveTextMaterial: "",
              menuListItemActiveBgIos: "",
              menuListItemActiveBgMaterial: "",
              touchRipple: "",
              groupTitleСontactsTextIos: "",
              groupTitleContactsTextMaterial: "",
              groupTitleContactsBgIos: "",
              groupTitleContactsBgMaterial: "",
            }}
            className="text-white"
            link
            chevronMaterial={false}
            title={title}
            text={text}
            media={
              <img
                className="ios:rounded-lg material:rounded-full ios:w-20 material:w-10"
                src={media}
                width="80"
                alt="treasure"
              />
            }
          />
        </Link>
      ))}
    </List>
  );
};

export default Quests;
