# APIS

Well the app is getting into shape :), now we are going to dig deeper into the pod concept, our goal is to have
a rich pod, but separating concerns and having each file with a clear goal.

In this example we will extract the rest api access from the container into a separate file, we will discuss 
where to place this funcionallity and how distinguish between server API model and pod View model, and how to 
perform conversions between entities.

# Step by Step Guide

- So now we want to extract the code that access to an API rest from the container, our firs instinct could be to create
a root _/api/_ folder, but what problems could we have by using this?

- We are placing

So let's try a radical change, let's store the api inside the pod... _WTF !!?!?!?! but then if you want to reuse it what happens_:

- Usually most of the calls you are going to make to a REST API will be just used by that give pod and no other pods.
- If there is a call to a given REST API that will be heavily resued by other pods (for instance lookups etc...), then 
we can promote that api to a _core/apis_ folder and use it every where.