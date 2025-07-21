# Death Counter

With the release of the Elden Ring DLC, I wanted to see how many times I died to each boss, as well as the number of times in the DLC as a whole. That inspired this project

The premise is simple, a Flask server that listens for a key to be pressed. When that happens, the server emits a Web Socket event to a React Front end which increments the counter until you hit enter.



Currently working on the second version of this.

