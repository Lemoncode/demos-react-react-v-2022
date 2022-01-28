# Layout

Fine... now we pages and routes under control, but... usually some pages
same some structure in common, e.g. a header, footer, and some others not
(e.g. login Screen).

If you jump back to the ASP .net days there was a concept call _master pages_
where you defined a layout, and a place holder to show the pages content, we
will implement something quite similar.

# Step by Step Guide

Ok, first of all, where should we display this _master pages_ / _layout_ 
definitions? Let's create a folder _layout_ under our _src_ folder.

```bash
cd src
```

```bash
mkdir layout
```

- First of all we will create a layout that will center the content, this layout will let us
simplifiy our Login Page:

_./src/layouts/center.layout.tsx_

```tsx
import React from 'react';

export const CenterLayout: React.FC = ({ children }) => (
  <div>
    {children}
  </div>
);
```
