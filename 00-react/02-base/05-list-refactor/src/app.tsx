import React from "react";
import { MemberEntity } from "./model";
import { MemberTable } from "./member-table";

export const App = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  return <MemberTable />;
};
