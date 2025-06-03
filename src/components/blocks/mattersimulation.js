import React, { useEffect, useRef, useState, useContext } from "react";
import Matter from "matter-js";
import sanityClient from "../../client";
import AppContext from "../../globalState";
import imageUrlBuilder from "@sanity/image-url";
import SVG from "react-inlinesvg";
// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}

// const imageUrl = urlFor(project.mainImage.asset).width(200).url();

const MatterSimulation = ({ projects }) => {
  const [hoveredBody, setHoveredBody] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [tooltipScreenPos, setTooltipScreenPos] = useState({ x: 0, y: 0 });
  const [grabbedBody, setGrabbedBody] = useState(null);
  const [grabbedStartX, setGrabbedStartX] = useState(null);

  const sceneRef = useRef(null);
  const engineRef = useRef(Matter.Engine.create({ gravity: { y: 0.1 } }));
  const renderRef = useRef(null);
  const mouseConstraintRef = useRef(null);
  const wallsRef = useRef([]);
  const [backGround, setBackground] = useState();

  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;

  const hasAnimatedIn = useRef(false);
  const animationStartTime = useRef(null);

  const isMobile = window.innerWidth < 768;
  const [stateHeight, setStateheight] = useState();

  const ENTRY_DURATION = 1500; // milliseconds
  const bodyTargetScale = isMobile ? 0.3 : 1;
  const imageEntryDistance = window.innerWidth * 1.2; // move in from off-screen

  const width = isMobile
    ? window.innerWidth - 30
    : window.innerWidth - 200 - 60;
  const height = isMobile ? window.innerHeight - 30 : window.innerHeight - 60;

  useEffect(() => {
    let collageLayers = [...info.collagelayers.images];
    setStateheight(height);
    const allStickers = projects.flatMap((p) =>
      Array.isArray(p.stickerarray)
        ? p.stickerarray.map((img) => ({
            imageUrl: urlFor(img.asset).width(300).url(),
            projectUrl: `/projects/${p.slug.current}`,
            title: p.title,
          }))
        : []
    );

    if (isMobile && info.collagelayersMobile) {
      collageLayers = [...info.collagelayersMobile.images];
    }

    if (allStickers.length === 0) return;

    const engine = engineRef.current;
    engine.timing.timeScale = 0.3; // Slow down simulation

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
      },
    });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);
    renderRef.current = render;

    // Inside the Matter setup section, after engine is created
    const createLayerImage = (src, factor = 0) => {
      const body = Matter.Bodies.rectangle(
        width / 2,
        height / 2,
        isMobile ? width * 4 : width,
        height,
        {
          isStatic: true,
          isSensor: true,
          collisionFilter: {
            category: 0,
            mask: 0,
            group: 0,
          },
          render: {
            sprite: {
              texture: src,
              // xScale: isMobile ? 2.5 : 1,
              // yScale: isMobile ? 2.5 : 1,
            },
          },
        }
      );
      body.scrollFactor = factor;
      body.initialPosition = { x: body.position.x, y: body.position.y };

      if (isMobile) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          const naturalHeight = img.naturalHeight;

          // Target: fill screen height while maintaining aspect ratio
          const scale = height / naturalHeight;

          body.render.sprite.xScale = scale;
          body.render.sprite.yScale = scale;

          // Optional: update body size to match scaled image
          Matter.Body.scale(body, scale, scale);
        };
      }
      return body;
    };

    const totalGroups = collageLayers.length + 1;
    const groupedBodies = Array.from({ length: totalGroups }, () => []);
    const allBodies = [];
    let repeatedStickers;

    if (allStickers.length < 15 && isMobile) {
      const totalBodies = 30;
      const repeatCount = Math.ceil(totalBodies / projects.length);
      repeatedStickers = Array.from({ length: repeatCount }, () => allStickers)
        .flat()
        .slice(0, totalBodies);
    } else {
      repeatedStickers = allStickers;
    }

    const baseSize = isMobile ? 40 : 90;
    const bodies = repeatedStickers.map((sticker, i) => {
      const imageUrl = sticker.imageUrl;
      const groupIndex = i % totalGroups;

      const scaleFactor = 0.5 + Math.random() * 1; // Random size multiplier
      const size = baseSize * scaleFactor;

      const body = Matter.Bodies.circle(
        Math.random() * width,
        Math.random() * height,
        size,
        {
          restitution: 1,
          friction: 17,
          render: {
            sprite: {
              texture: imageUrl,
              xScale: isMobile ? 0.5 : 1,
              yScale: isMobile ? 0.5 : 1,
            },
          },
        }
      );

      body.spawnDelay = i * 0.1;
      body.hasSpawned = false;

      // Set sprite visually invisible
      body.render.sprite.xScale = 0.01;
      body.render.sprite.yScale = 0.01;

      body.baseRadius = 30;
      body.baseSpriteScale = isMobile ? 0.5 : 1;

      Matter.Body.scale(body, body.baseRadius / 30, body.baseRadius / 30);
      body.render.sprite.xScale = body.baseSpriteScale;
      body.render.sprite.yScale = body.baseSpriteScale;

      body.projectUrl = sticker.projectUrl;
      body.title = sticker.title;
      groupedBodies[groupIndex].push(body);
      allBodies.push(body);
      return body;
    });

    const renderStack = [];

    if (collageLayers && collageLayers.length > 0) {
      setBackground(collageLayers.shift());
    }

    collageLayers.forEach((image, i) => {
      const scrollFactor = (i - (collageLayers.length - 1) / 2) * 0.3;
      const layerBody = createLayerImage(
        urlFor(image).width(width).url(),
        scrollFactor
      );
      if (groupedBodies[i]) {
        renderStack.push(...groupedBodies[i]);
      }
      renderStack.push(layerBody);

      layerBody._layerIndex = i;
    });

    // Add last group if any
    if (groupedBodies[collageLayers.length]) {
      renderStack.push(...groupedBodies[collageLayers.length]);
    }

    Matter.World.add(engine.world, renderStack);

    const createWalls = (width, height) => {
      const wallOptions = { isStatic: true, render: { visible: false } };
      return [
        Matter.Bodies.rectangle(width / 2, 0, width, 10, wallOptions),
        Matter.Bodies.rectangle(width / 2, height, width, 10, wallOptions),
        Matter.Bodies.rectangle(0, height / 2, 10, height, wallOptions),
        Matter.Bodies.rectangle(width, height / 2, 10, height, wallOptions),
      ];
    };

    wallsRef.current = createWalls(width, height);
    Matter.World.add(engine.world, wallsRef.current);

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Matter.World.add(engine.world, mouseConstraint);
    mouseConstraintRef.current = mouseConstraint;

    render.mouse = mouse;
    mouseConstraint.mouse.element.removeEventListener(
      "wheel",
      mouseConstraint.mouse.mousewheel
    );

    Matter.Events.on(mouseConstraint, "startdrag", (event) => {
      const body = event.body;
      if (body && body.projectUrl) {
        setGrabbedBody(body);
        setGrabbedStartX(body.position.x);

        const updateTooltipPos = () => {
          const { x, y } = body.position;
          setTooltipScreenPos({ x, y });
        };

        Matter.Events.on(engine, "afterUpdate", updateTooltipPos);

        // Save cleanup function to detach later
        body._tooltipCleanup = () => {
          Matter.Events.off(engine, "afterUpdate", updateTooltipPos);
        };
      }
    });

    Matter.Events.on(mouseConstraint, "enddrag", (event) => {
      const body = event.body;
      if (body && body._tooltipCleanup) {
        body._tooltipCleanup(); // clean up listener
        delete body._tooltipCleanup;
      }

      if (body && body.projectUrl) {
        const dropX = body.position.x;
        const rightEdge = width - 50;
        const travel = Math.abs(body.position.x - grabbedStartX);
        if (dropX >= rightEdge && travel > 40) {
          window.location = body.projectUrl;
        }
      }

      setGrabbedBody(null);
      setGrabbedStartX(null);
    });

    const handleClick = (e) => {
      const { x, y } = mouse.position;
      const found = Matter.Query.point(bodies, { x, y });

      if (found.length > 0 && found[0].projectUrl) {
        window.location = found[0].projectUrl;
      }
    };

    render.canvas.addEventListener("dblclick", handleClick);

    const scrollLayers = renderStack.filter(
      (b) => b.scrollFactor !== undefined
    );

    const handleScroll = () => {
      // let lastScrollY = window.scrollY;
      scrollLayers.forEach((layer) => {
        const { scrollFactor, initialPosition } = layer;
        Matter.Body.setPosition(layer, {
          x: initialPosition.x + window.scrollY * scrollFactor,
          y: initialPosition.y,
        });
      });
    };

    window.addEventListener("scroll", handleScroll);

    const handleOrientation = (event) => {
      const gravity = engine.world.gravity;
      gravity.x = event.gamma / 90;
      gravity.y = event.beta / 90;
    };

    if (/Mobi|Android/i.test(navigator.userAgent)) {
      window.addEventListener("deviceorientation", handleOrientation);
    }

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;

      const newWidth = isMobile
        ? window.innerWidth - 30
        : window.innerWidth - 200 - 60;
      const newHeight = isMobile
        ? window.innerHeight - 30
        : window.innerHeight - 60;

      setStateheight(newHeight);
      render.bounds.max.x = newWidth;
      render.bounds.max.y = newHeight;
      render.options.width = newWidth;
      render.options.height = newHeight;
      render.canvas.width = newWidth;
      render.canvas.height = newHeight;

      scrollLayers.forEach((layer) => {
        const { scrollFactor } = layer;
        const newX = newWidth / 2 + window.scrollY * scrollFactor;
        const newY = newHeight / 2;
        layer.initialPosition = { x: newX, y: newY };
        Matter.Body.setPosition(layer, { x: newX, y: newY });
      });

      const scaleRatio = isMobile ? 0.5 : 1.0; // or dynamic, based on width

      allBodies.forEach((body) => {
        // RESIZE physics
        const targetRadius = body.baseRadius * scaleRatio;
        const currentRadius = body.circleRadius || 40;
        const scaleFactor = targetRadius / currentRadius;

        Matter.Body.scale(body, scaleFactor, scaleFactor);

        // RESIZE sprite
        const newSpriteScale = body.baseSpriteScale * scaleRatio;
        body.render.sprite.xScale = newSpriteScale;
        body.render.sprite.yScale = newSpriteScale;
      });

      Matter.World.remove(engine.world, wallsRef.current);
      wallsRef.current = createWalls(newWidth, newHeight);
      Matter.World.add(engine.world, wallsRef.current);
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (event) => {
      const { x, y } = mouse.position;
      const found = Matter.Query.point(allBodies, { x, y });

      if (found.length > 0) {
        setHoveredBody(found[0]);
        setHoverPosition({ x, y });
        found[0].render.lineWidth = 4;
        found[0].render.strokeStyle = "#fff";
        // allBodies.forEach((body) => {
        //   if (body === found[0]) {
        //     body.render.opacity = 1;

        //   } else {
        //     body.render.opacity = 0.9;
        //     body.render.lineWidth = 0;
        //   }
        // });
      } else {
        setHoveredBody(null);
      }
    };

    render.canvas.addEventListener("mousemove", handleMouseMove);

    Matter.Events.on(engine, "beforeUpdate", () => {
      const now = Date.now();

      if (!hasAnimatedIn.current) {
        if (!animationStartTime.current) {
          animationStartTime.current = now;
        }

        const elapsed = now - animationStartTime.current;

        // Animate sticker bodies with stagger
        allBodies.forEach((body, i) => {
          const localT = (elapsed - body.spawnDelay) / ENTRY_DURATION;

          if (localT >= 1 && !body.hasSpawned) {
            body.hasSpawned = true;
            body.render.sprite.xScale = bodyTargetScale;
            body.render.sprite.yScale = bodyTargetScale;
            return;
          }

          if (localT > 0 && localT < 1) {
            const ease = 1 - Math.pow(1 - localT, 3); // easeOutCubic
            const newScale = bodyTargetScale * ease;

            // Just update sprite, not physics size
            body.render.sprite.xScale = newScale;
            body.render.sprite.yScale = newScale;
          }
        });

        // Animate layer slide-in
        scrollLayers.forEach((layer, i) => {
          const layerT = Math.min(1, elapsed / ENTRY_DURATION);
          const ease = 1 - Math.pow(1 - layerT, 3);
          const fromLeft = i % 2 === 0;
          const offset = fromLeft ? -imageEntryDistance : imageEntryDistance;
          const targetX = layer.initialPosition.x;
          const newX = targetX + offset * (1 - ease);

          Matter.Body.setPosition(layer, {
            x: newX,
            y: layer.initialPosition.y,
          });
        });

        if (elapsed > ENTRY_DURATION + allBodies.length * 50) {
          hasAnimatedIn.current = true;
        }
      }
    });

    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("resize", handleResize);
      render.canvas.removeEventListener("mousemove", handleMouseMove);
    };
    // eslint-disable-next-line
  }, [projects, bodyTargetScale, height, imageEntryDistance, isMobile]);

  return (
    <>
      {/* <div className="canvasShower"></div> */}
      <div
        ref={sceneRef}
        className={"fixedCanvas"}
        style={{
          height: stateHeight,
          backgroundImage:
            "url(" +
            urlFor(backGround)
              .width(isMobile ? 900 : window.innerWidth)
              .url() +
            ")",
        }}
      />
      {hoveredBody && (
        <div
          style={{
            position: "fixed",
            left: hoverPosition.x,
            top: hoverPosition.y,
          }}
          className="hoverSquare"
        >
          <p>{hoveredBody.title}</p>
          <SVG
            src={"/frames/icons/tabtosee.svg"}
            style={{ width: "100%", height: "100%", display: "block" }}
            preProcessor={(code) =>
              code.replace(/<svg/, '<svg preserveAspectRatio="none"')
            }
          />
          {/* <p>doubletap to see</p> */}
        </div>
      )}
      {grabbedBody && width < 786 && (
        <div
          className={
            tooltipScreenPos.x < width - 50 ? "tooltip" : "tooltip active"
          }
          style={{
            position: "fixed",
            left: tooltipScreenPos.x,
            top: tooltipScreenPos.y,

            zIndex: 1000,
          }}
        >
          <SVG
            src={"/frames/icons/dragtosee.svg"}
            style={{ width: "100%", height: "100%", display: "block" }}
            preProcessor={(code) =>
              code.replace(/<svg/, '<svg preserveAspectRatio="none"')
            }
          />
          <p>{tooltipScreenPos.x < width - 50 ? "" : "yes here "}</p>
        </div>
      )}
    </>
  );
};

export default MatterSimulation;
