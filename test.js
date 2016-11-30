scene.background = scene.addSprite("blippar_background.png")
                            .setName("background")
		                    .setScale(sw, sh, 1)
		                    .setClickable(false);
		                    
scene.textMsg = scene.addText("Click to open overlayHTML")
      .setTranslation(0, -360, 1)
      .setScale(2)
      .setColor('FF0000')
      .setClickable(true);

scene.textMsg.onTouchEnd = function (id, x, y) {
  console.log("called:"+id);
};

