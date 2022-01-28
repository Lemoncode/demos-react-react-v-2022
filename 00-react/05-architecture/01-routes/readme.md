# Routes

So far we have created an application that works, but that can be hardly maintained and it wouldn't be abel to scale.

In the following examples we are going to refactor the app, in order to make more maintanable and let it grow
and scale.

All that we are going to apply here can be considered an overkill for such an small application, but it will
be our playground.

Let's start setting up routes:

We are going to refactor the navigation routes we have defined:

# Step by Step Guide

- Let's copy the previous example (04-basic-app/04-detail)

- Right now we have all the files mixed at _src_ folder level, this can become quite messy
  the project keeps on growing.

- Let's make a very basic and logical refactor, we are going to create a folder
  called _scenes_ to store all the pages:

```bash
cd src
```

```bash
mkdir scenes
```

> Tip if this grows we can create subfolders grouping the scenes by category

Now let's move all the pages to that scene folder.

Let's check that we haven't broken anything :)

```bash
npm start
```

If we take a look to _app.tsx_ VS Code has already updated the paths to that
files, not bad :), but if we take a look we are using relatives path to
reference that files, in this case is something that doesn't hurt quite a lot:

```tsx
import { LoginPage } from "./scenes/login";
import { ListPage } from "./scenes/list";
import { DetailPage } from "./scenes/detail";
```

But if were importing this scene from a subfolder we would start having the
dot dot hell, we could end up with imports like _../../../scenes/login_, why
not creating aliases for the root folders that could be accessed in a simple way?

We can defined paths in _tsconfig_ and aliases in _webpack_ uuh wait but then
we have to define similar stuff in two places, let's provide a solution that
would avoid this, first of all we are going to define and _@_ alias in our
_tsconfig.json_:

_tsconfig.json_

```diff
    "esModuleInterop": true,
+    "baseUrl": "src",
+    "paths": {
+      "@/*": ["*"]
+    }
  },
```

Cool now we could add this configuration to webpack (WAIT do not do that):

_webpack.config.json_

```diff
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
+   '@': path.resolve(__dirname, 'src'),
  },
```

But since we don't want to repeat code, let's see if somebody has
implemented some magic to allow webpack read this configuration from
the _tsconfig_

We have two approaches

- Gist source code: https://gist.github.com/nerdyman/2f97b24ab826623bff9202750013f99e

- Webpack plugin: https://www.npmjs.com/package/tsconfig-paths-webpack-plugin

Let's go for the webpack plugin option:

```bash
npm install tsconfig-paths-webpack-plugin --save-dev
```

Now let's consume this plugin:

_./webpack.config.js_

```diff
const HtmlWebpackPlugin = require("html-webpack-plugin");
+ const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require("path");
const basePath = __dirname;

module.exports = {
  context: path.join(basePath, "src"),
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
+   plugins: [new TsconfigPathsPlugin()]
  },
```

Now we can update the imports to use the new _@_ alias.

_./src/app.tsx_

```diff
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
- import { LoginPage } from "./scenes/login";
- import { ListPage } from "./scenes/list";
- import { DetailPage } from "./scenes/detail";
+ import { LoginPage } from "@/scenes/login";
+ import { ListPage } from "@/scenes/list";
+ import { DetailPage } from "@/scenes/detail";
```

Let's refine this a little bit, having to paste an import per
page sounds a little bit repetitive and in the other hand if
in the future we decide to group some scenes under some subfolders
it may impact the _app_ imports declarations, let's create a barrel:

_./src/scenes/index.ts_

```ts
export * from "./detail";
export * from "./list";
export * from "./login";
```

And let's simplify our _app.tsx_

_./src/app.tsx_

```diff
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
- import { LoginPage } from "@/scenes/login";
- import { ListPage } from "@/scenes/list";
- import { DetailPage } from "@/scenes/detail";
+ import {LoginPage, ListPage, DetailPage} from from "@/scenes";

export const App = () => {
```


