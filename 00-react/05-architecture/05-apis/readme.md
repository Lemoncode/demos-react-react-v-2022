# APIS

Well the app is getting into shape :), now we are going to dig deeper into the pod concept, our goal is to have
a rich pod, but separating concerns and having each file with a clear goal.

In this example we will extract the rest api access from the container into a separate file, we will discuss
where to place this funcionallity and how distinguish between server API model and pod View model, and how to
perform conversions between entities.

# Step by Step Guide

- So now we want to extract the code that access to an API rest from the container, our firs instinct could be to create
  a root _/api/_ folder, but what problems could we have by using this?

- We are taking far away related assets, each time we want to touch the repo and we are on the container we have
  to dig in to the folder api deep blue sea.

- Is hard to know which api is being used where, maybe we can introduce some change by mistake in a given api
  that could impact another pod.

- It's easy to generate conflicts with other developers in the team since we are updating common stuff.

- If we want to extract the pod functionality we have to gran some files from the pod, some other from the api folder,
  is not straight forward.

So let's try a radical change, let's store the api inside the pod... _WTF !!?!?!?! but then if you want to reuse it what happens_:

- Usually most of the calls you are going to make to a REST API will be just used by that give pod and no other pods.
- If there is a call to a given REST API that will be heavily resued by other pods (for instance lookups etc...), then
  we can promote that api to a _core/apis_ folder and use it every where.

- Let's start refactoring the login page, in this case we will go one step further:

  - We have to be prepared for the "real thing" integration, right now we are just check some dummy user/password in a
    synchronous way.
  - Why not creating a client API that will return a promise with the expected result, by following this approach:
    - Once we get the real server API we only need to update the api file, the rest of assets / components won't
      be affected.
    - We can configure using an environment variable whether to use the real or the mock client api (this will let us
      perform e2e testing, or if the server is down keep on progressing using the mock approach).

- First let's simulate a client API:

_@pods/login/login.api.ts_

```ts
export const doLogin = (
  username: string,
  password: string
): Promise<Boolean> => {
  const promise = new Promise<Boolean>((resolve, reject) => {
    // Simulating Ajax Call
    setTimeout(() => {
      resolve(username === "admin" && password === "test");
    }, 500);
  });
  return promise;
};
```

> For the sake of simplicity we are using the standar promise handling, we could use async await but it would
> need some extra setup plumbing (regenerator runtime).

- And now let's consume it in the login container.

_./src/pods/login/login.container.tsx_

```diff
+ import { doLogin } from './login.api';

// (...)

  const handleLogin = (username: string, password: string) => {
-    if (username === "admin" && password === "test") {
-      setUserProfile({ userName: username });
-      navigate(routes.list);
-    } else {
-      alert("User / password not valid, psst... admin / test");
-    }
+    doLogin(username, password).then(result => {
+      if(result) {
+         setUserProfile({ userName: username });
+         navigate(routes.list);
+      } else {
+        alert("User / password not valid, psst... admin / test");
+     }
+    })
  };
```

- This is not api related, but is a good moment to check how easy is to create a custom component,
  if we take a look to this container, it is starting to have some code that is not related with
  rendering, we may think about encapsulating some funcionality in a custom hook, something like:

```diff
+ const useLoginHook = () => {
+  const navigate = useNavigate();
+  const { setUserProfile } = React.useContext(ProfileContext);
+
+  cosnt loginSucceededAction = (userName) => {
+        setUserProfile({ userName });
+        navigate(routes.list);
+  }
+
+  const loginFailedAction = () => {
+    alert("User / password not valid, psst... admin / test");
+  }
+  return {loginSucceededAction, loginFailedAction}
+}

export const LoginContainer: React.FC = () => {
-  const navigate = useNavigate();
-  const { setUserProfile } = React.useContext(ProfileContext);
+  const {loginSucceededAction, loginFailedAction} = useLoginHook();

  const handleLogin = (username: string, password: string) => {
    doLogin(username, password).then((result) => {
      if (result) {
-        setUserProfile({ userName: username });
-        navigate(routes.list);
+        loginSucceededAction(username);
      } else {
-        alert("User / password not valid, psst... admin / test");
+        loginFailedAction();
      }
    });
  };

  return <LoginComponent onLogin={handleLogin} />;
};
```

We could even go on step forward and encapsulate handleLogin in the hook.
