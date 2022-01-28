# Pods

So far breaking into pages seems to be a fair solutions since our app is very simple, but imagine a real scenario:

- If our page logic grows then we have to split it into different files, we would have to create a folder per page.
- A given folder can have rich functionallity that could be reused in other pages, or a given page could
  use several rich pieces.
- In some SSR frameworks, the page is on a public folder and we don't want to mess it up with other files (e.g.
  business logic, mappers...)
- Is not a bad idea to separate concerns and ensure that the page only handle page related stuff, choose layout,
  handle navigation params...

Following ember approach we are going to encapsulate rich functionallity in pods, this pods will be rich isolated
functionallity islands, based on our experiencie the pod / page mapping use to be one to one, but there are
cases where a given page can consume more than one pod (e.g. dashboard), or the other way around (e.g. a login
pod that is used in several places in the app login page, menu login layer, etc...)

# Step by step guide

- Let's start refactoring this, we will start by creating a pods folder:

```bash
cd src
```

```bash
mkdir pods
```

- In this case we will define the following pods:
  - login
  - list
  - detail

```bash
cd pods
```

```bash
mkdir login
```

```bash
mkdir list
```

```bash
mkdir detail
```

Let's start migrating the login page content, usually we will create a first level container component
that will hold the state and a dumb component that will contain the layout (in this case we could discuss
whether this is not neccessary and in other we will need a more elaborated solutions for instance create
components folder to breakdown the dumb components into more levels, or...):

We will refactor the login code in order to isolate what is container aim and component stuff (low level
submit args etc...)

_./pods/login/login.container.tsx_

```tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
import { ProfileContext } from "@/core/profile";

export const LoginContainer: React.FC = () => {
  const navigate = useNavigate();
  const { setUserProfile } = React.useContext(ProfileContext);

  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "test") {
      setUserProfile({ userName: username });
      navigate(routes.list);
    } else {
      alert("User / password not valid, psst... admin / test");
    }
  };

  return <LoginComponent OnLogin={handleLogin} />;
};
```

- Is time to define the contract for the props:

_./pods/login/login.component.tsx_

```tsx
import React, { VoidFunctionComponent } from "react";

interface Props {
  onLogin: (username: string, password: string) => void;
}

export const LoginComponent: React.FC = () => {
  return <></>;
};
```

Let's import the component in the container

_./src/login.container.tsx_

```diff
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "core";
import { ProfileContext } from "@/core/profile";
+ import {LoginComponent} from './login.component';
```

- Time to dig into Login Component

```diff
import React, { VoidFunctionComponent } from "react";

interface Props {
  onLogin : (username: string, password: string) => void;
}

export const LoginComponent: React.FC = () => {
  return <></>
}
```

_./pods/login/index.ts_
