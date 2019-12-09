# N-Body Particle Simulator(ish)
While maybe not the most physically accurate gravity simulator out there, I like to think it at least gets the job done. With that said, I built this mainly to get some initial experience with HTML5 canvas and using it for drawing computational simulations. I've included a license in case for some reason you want to use this for something. 

## Usage
Simply open the `index.html` and watch the particle fun begin. For now, you can play with the different parameters for the simulation by changing the parameters at the top of the `index.js` file.

## TODOs
* Use a `Vector` class instead of doing vector math by hand when I need vector values
* Have merged particles change to the weighted average of their colors based on their mass
* Preserve some form of momentum after collisions
* Create interface for controlling different parameters
* Use the symmetry of gravitational force to reduce the time complexity of the gravity loop