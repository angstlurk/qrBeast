import { List, ListItem } from "konsta/react";
import { Link } from "react-router-dom";
import { questList } from "./questList";

const Quests = () => {
  return (
    <List strongIos outlineIos>
      {questList.map(({ to, title, text, media }) => (
        <Link to={to}>
          <ListItem
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
