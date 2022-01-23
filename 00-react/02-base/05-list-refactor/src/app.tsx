import React from "react";
import { MemberEntity } from "./model";
import { MemberTableRow } from "./member-table-row";
import { MemberTable } from "./member-table";

export const App = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/orgs/lemoncode/members`)
      .then((response) => response.json())
      .then((json) => setMembers(json));
  }, []);

  return <MemberTable />;
};
