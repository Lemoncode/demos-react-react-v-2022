import {MemberEntity} from './list.vm'

export const GetMemberCollection = () : Promise<MemberEntity[]> => 
  fetch(`https://api.github.com/orgs/lemoncode/members`)
  .then((response) => response.json())
