**You probably want the [new version of deathmapnyc](https://github.com/zischwartz/deathmapnyc), this is the first version.**

To get started with the web app, run

```
npm install
gulp
```

And you should see the contents of `dist` dir at [http://localhost:8882](http://localhost:8882).

To work with the underlying data, the easiest thing to do is to `cd data_processing` and run a docker container with ipython/jupyter loaded on it, like so:

```
docker run -it -v $PWD:/root ipython/scipystack /bin/bash
```

