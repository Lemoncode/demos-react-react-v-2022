import React from "react";
import { ListComponent } from "./list.component";
import { MemberEntity } from "./list.vm";
import { GetMemberCollection } from "./list.api";

export const ListContainer: React.FC = () => {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  React.useEffect(() => {
    GetMemberCollection().then((memberCollection: MemberEntity[]) =>
      setMembers(memberCollection)
    );
  }, []);

  return <ListComponent members={members} />;
};
