// Scene global variables
scene.animDuration     = 5000;
scene.intervalDuration = scene.animDuration + 500;
scene.meshIndexStart   = 1;
scene.meshIndexStop    = 100;
scene.fighterSound     = "fighther_launch.mp3";
scene.themeSong        = "theme_song.mp3";
scene.tPathsList       = ["tpath_1.md2", "tpath_2.md2", "tpath_3.md2"];
scene.tPathsMax		   = 3;

// Load additional ressources
scene.setRequiredAssets(scene.tPathsList);
scene.addRequiredAssets([scene.fighterSound, scene.themeSong]);

// Get the scene objects
scene.background = scene.getChild("background");
scene.tpath      = scene.getChild("tpath");
scene.tieFighter = scene.tpath.getChild("tieFighter");

// Adjust background size
scene.background.setScale(sW, sH, 1);
